<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    // import type { PageData } from "./$types.js";
    let {data} = $props()
    console.log("dashboard : ", data)
  </script>
  
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
      </div>
    </div>
  
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <!-- Grille de contenu -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Card Profil -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Profil utilisateur</dt>
                  <dd class="text-lg font-medium text-gray-900">{data.user?.name}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="font-medium text-gray-500">Email:</span>
              <span class="text-gray-900 ml-2">{data.user?.email}</span>
            </div>
          </div>
        </div>

        <!-- Card games -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Games Stats</dt>
                    <dd class="text-lg font-medium text-gray-900">Victories : {data.user?.victories}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <span class="font-medium text-gray-500">Win ratio :</span>
                <span class="text-gray-900 ml-2">{data.user?.games != 0 ? Math.floor((data.user?.victories/ data.user?.games)*100) : 0} %</span>
              </div>
            </div>
          </div>
  
        <!-- Card Statut -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Statut du compte</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {data.user?.emailVerified ? "Vérifié" : "Non vérifié"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="font-medium text-gray-500">Session ID:</span>
              <span class="text-gray-900 ml-2 font-mono text-xs">{data.session?.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
  
        <!-- Card Activité -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Dernière activité</dt>
                  <dd class="text-lg font-medium text-gray-900">Maintenant</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <span class="font-medium text-gray-500">Créé le:</span>
              <span class="text-gray-900 ml-2">
                {new Date(data.user?.createdAt || '').toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Section contenu principal -->
      <div class="mt-8">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Bienvenue dans votre espace personnel
            </h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Voici votre dashboard personnel. Vous pouvez ici gérer votre compte, 
                consulter vos informations et accéder aux différentes fonctionnalités de l'application.
              </p>
            </div>
            <div class="mt-5">
              <div class="rounded-md bg-blue-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3 flex-1 md:flex md:justify-between">
                    <p class="text-sm text-blue-700">
                      Votre authentification fonctionne parfaitement ! 
                      Vous êtes connecté avec Better Auth et MongoDB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Section informations détaillées -->
      <div class="mt-8 bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Informations détaillées
          </h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">ID utilisateur</dt>
              <dd class="mt-1 text-sm text-gray-900 font-mono">{data.user?.id}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Adresse email</dt>
              <dd class="mt-1 text-sm text-gray-900">{data.user?.email}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Nom complet</dt>
              <dd class="mt-1 text-sm text-gray-900">{data.user?.name}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email vérifié</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {data.user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                  {data.user?.emailVerified ? "Vérifié" : "En attente"}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Date de création</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {new Date(data.user?.createdAt || '').toLocaleString('fr-FR')}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {new Date(data.user?.updatedAt || '').toLocaleString('fr-FR')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>