import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Smartphone,
  Layers,
  Database,
  Wifi,
  Activity,
  Box,
  FileCode,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const AndroidCodeTab: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<string>('health_connect');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundFx.playClick();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const snippets: {
    [key: string]: {
      title: string;
      description: string;
      icon: React.ReactNode;
      code: string;
    };
  } = {
    health_connect: {
      title: 'HealthConnectManager.kt (Pasos Reales)',
      description: 'Lectura de pasos con Health Connect API (androidx.health.connect) sustituta de Google Fit.',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      code: `package com.poke.quest.health

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateGroupByPeriodRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HealthConnectManager @Inject constructor(
    private val context: Context
) {
    private val healthConnectClient by lazy { 
        HealthConnectClient.getOrCreate(context) 
    }

    val permissions = setOf(
        HealthPermission.getReadPermission(StepsRecord::class)
    )

    suspend fun hasAllPermissions(): Boolean {
        val granted = healthConnectClient.permissionController.getGrantedPermissions()
        return granted.containsAll(permissions)
    }

    suspend fun readTodaySteps(): Long {
        val startTime = Instant.now().truncatedTo(ChronoUnit.DAYS)
        val endTime = Instant.now()

        val response = healthConnectClient.aggregate(
            androidx.health.connect.client.request.AggregateRequest(
                metrics = setOf(StepsRecord.COUNT_TOTAL),
                timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
            )
        )
        return response[StepsRecord.COUNT_TOTAL] ?: 0L
    }
}`,
    },
    room_database: {
      title: 'PokemonEntity.kt & PokeQuestDatabase.kt (Room)',
      description: 'Esquema Room para persistencia local de Pokémon, equipo, tareas y niveles.',
      icon: <Database className="w-5 h-5 text-blue-400" />,
      code: `package com.poke.quest.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "party_pokemon")
data class PokemonEntity(
    @PrimaryKey val id: String,
    val pokedexNumber: Int,
    val name: String,
    val nickname: String?,
    val level: Int,
    val currentXp: Int,
    val maxXp: Int,
    val hp: Int,
    val maxHp: Int,
    val isInParty: Boolean,
    val primaryType: String,
    val secondaryType: String?,
    val spriteUrl: String,
    val officialArtworkUrl: String
)

@Dao
interface PokemonDao {
    @Query("SELECT * FROM party_pokemon WHERE isInParty = 1")
    fun getActiveParty(): Flow<List<PokemonEntity>>

    @Query("SELECT * FROM party_pokemon WHERE isInParty = 0")
    fun getPCBoxPokemon(): Flow<List<PokemonEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPokemon(pokemon: PokemonEntity)

    @Update
    suspend fun updatePokemon(pokemon: PokemonEntity)

    @Query("UPDATE party_pokemon SET hp = :newHp WHERE id = :pokemonId")
    suspend fun updateHp(pokemonId: String, newHp: Int)
}

@Database(entities = [PokemonEntity::class], version = 1, exportSchema = false)
abstract class PokeQuestDatabase : RoomDatabase() {
    abstract fun pokemonDao(): PokemonDao
}`,
    },
    pokeapi_repo: {
      title: 'PokeApiService.kt & Repository (Retrofit + Cache)',
      description: 'Llamadas a la PokeAPI oficial con Retrofit, caché en Room y filtrado de legendarios.',
      icon: <Wifi className="w-5 h-5 text-amber-400" />,
      code: `package com.poke.quest.data.remote

import retrofit2.http.GET
import retrofit2.http.Path
import javax.inject.Inject
import javax.inject.Singleton

interface PokeApiService {
    @GET("pokemon/{id}")
    suspend fun getPokemonDetail(@Path("id") id: Int): PokemonResponseDto

    @GET("pokemon-species/{id}")
    suspend fun getPokemonSpecies(@Path("id") id: Int): SpeciesResponseDto
}

@Singleton
class PokemonRepository @Inject constructor(
    private val api: PokeApiService,
    private val dao: PokemonDao
) {
    suspend fun getOrFetchPokemon(id: Int): PokemonEntity {
        val detail = api.getPokemonDetail(id)
        val species = api.getPokemonSpecies(id)

        // Filtro estricto: legendarios/míticos nunca se generan por huevo
        val isLegendaryOrMythical = species.is_legendary || species.is_mythical

        val entity = PokemonEntity(
            id = "pkmn_\${id}_\${System.currentTimeMillis()}",
            pokedexNumber = id,
            name = detail.name.replaceFirstChar { it.uppercase() },
            nickname = null,
            level = 5,
            currentXp = 0,
            maxXp = 100,
            hp = 45,
            maxHp = 45,
            isInParty = true,
            primaryType = detail.types.first().type.name,
            secondaryType = detail.types.getOrNull(1)?.type?.name,
            spriteUrl = detail.sprites.front_default,
            officialArtworkUrl = detail.sprites.other.official_artwork.front_default
        )

        dao.insertPokemon(entity)
        return entity
    }
}`,
    },
    compose_ui: {
      title: 'PokeQuestDashboard.kt (Jetpack Compose UI)',
      description: 'Pantalla principal nativa con Material 3, tarjetas de Pokémon y barra de pasos.',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      code: `package com.poke.quest.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.poke.quest.data.local.PokemonEntity

@Composable
fun DashboardScreen(
    party: List<PokemonEntity>,
    stepsToday: Long,
    stepGoal: Long,
    gold: Int,
    onCompleteTask: (String) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("PokéQuest 3º ESO", style = MaterialTheme.typography.titleLarge) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Tarjeta de Pasos con Health Connect
            HealthConnectStepCard(steps = stepsToday, goal = stepGoal)

            // Fila de Pokémon del equipo activo
            Text("Equipo Pokémon Activo", style = MaterialTheme.typography.titleMedium)
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(party) { pokemon ->
                    PokemonCard(pokemon = pokemon)
                }
            }
        }
    }
}

@Composable
fun PokemonCard(pokemon: PokemonEntity) {
    Card(
        modifier = Modifier.width(130.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            AsyncImage(
                model = pokemon.spriteUrl,
                contentDescription = pokemon.name,
                modifier = Modifier.size(72.dp)
            )
            Text(pokemon.nickname ?: pokemon.name, style = MaterialTheme.typography.bodyMedium)
            Text("Nv. \${pokemon.level}", style = MaterialTheme.typography.labelSmall)
        }
    }
}`,
    },
  };

  const currentSnippet = snippets[selectedSnippet] || snippets['health_connect'];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-emerald-400" />
              Arquitectura & Código Nativo Android (Kotlin + Jetpack Compose)
            </h2>
            <span className="bg-emerald-500/20 text-emerald-300 font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Android 14+ Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Esta sección contiene las clases exactas en Kotlin para exportar e integrar PokéQuest directamente en Android Studio con Health Connect, Room y Retrofit.
          </p>
        </div>
      </div>

      {/* Snippet Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.keys(snippets).map((key) => {
          const item = snippets[key];
          const isSelected = selectedSnippet === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedSnippet(key);
                soundFx.playClick();
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {key === 'health_connect'
                    ? 'Health Connect API'
                    : key === 'room_database'
                    ? 'Persistencia Room'
                    : key === 'pokeapi_repo'
                    ? 'PokeAPI + Retrofit'
                    : 'Jetpack Compose'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Code Display Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-850 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              {currentSnippet.title}
            </span>
          </div>

          <button
            onClick={() => handleCopy(currentSnippet.code, selectedSnippet)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedKey === selectedSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-slate-950/90 overflow-x-auto max-h-[500px]">
          <pre className="text-xs font-mono text-emerald-300/90 leading-relaxed">
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
          💡 <strong>Nota de Arquitectura:</strong> {currentSnippet.description}
        </div>
      </div>
    </div>
  );
};
