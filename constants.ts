import { Domain, Benchmarks, BudgetItems, AnssiSolutionCategory } from './types';

// DOMAINES DE L'AUDIT
export const DOMAINS: Domain[] = [
  // 0. Obsolescence Hardware (Socle Physique)
  {
    title: "Obsolescence & Socle Hardware",
    icon: '🏗️',
    color: 'bg-orange-600',
    description: "État du parc matériel (Serveurs/Stockage). Un matériel obsolète ne peut plus être sécurisé (failles firmware/BIOS).",
    questions: [
      {
        id: 'obs-1',
        text: "Quel est l'âge moyen de votre parc de serveurs physiques ?",
        help: "Au-delà de 5 ans, les serveurs ne reçoivent plus de correctifs de sécurité critiques (BIOS/Firmware) et sont vulnérables aux attaques bas niveau.",
        options: ["Plus de 7 ans ou inconnu", "Entre 5 et 7 ans", "Entre 3 et 5 ans", "Moins de 3 ans"],
        weight: 3,
        ugapSuggestion: {
            name: "Renouvellement Serveurs Gen11",
            description: "Anciens serveurs = Risque Cyber critique. Passage sur HPE ProLiant Gen11 avec sécurité ancrée dans le silicium (Silicon Root of Trust).",
            vendors: ["HPE ProLiant", "Dell PowerEdge"],
            marketRef: "Marché UGAP Serveurs & Calcul"
        }
      },
      {
        id: 'obs-2',
        text: "Vos baies de stockage sont-elles sous support constructeur actif ?",
        help: "Le support garantit l'accès aux mises à jour contre les failles. Un stockage hors support met en danger toutes vos données.",
        options: ["Support expiré ou fin de vie (EOS)", "Pas de baie de stockage", "Oui, support standard", "Oui, support J+1 ou 4h"],
        weight: 3,
        ugapSuggestion: {
            name: "Modernisation Stockage Flash",
            description: "Remplacement des baies obsolètes par du stockage Full Flash NVMe sécurisé et chiffré par défaut.",
            vendors: ["PureStorage", "NetApp", "HPE Alletra", "Huawei"],
            marketRef: "Marché UGAP Stockage"
        }
      },
      {
        id: 'obs-3',
        text: "Vos équipements réseaux (Switchs/Cœur) supportent-ils les derniers standards ?",
        help: "Vos switchs doivent supporter l'authentification 802.1x et les ACLs pour permettre la segmentation du réseau.",
        options: ["Switchs non manageables", "Matériel obsolète (Fin de support)", "Matériel ancien mais mis à jour", "Oui, matériel récent (<5 ans)"],
        weight: 2,
        ugapSuggestion: {
            name: "Refonte Cœur de Réseau",
            description: "Renouvellement des commutateurs pour activer la micro-segmentation et l'authentification des équipements.",
            vendors: ["HPE Aruba Networking", "Cisco", "Huawei"],
            marketRef: "Marché UGAP Réseaux"
        }
      },
    ]
  },
  // 1. Gouvernance
  {
    title: 'Gouvernance de la sécurité',
    icon: '🏛️',
    color: 'bg-blue-500',
    description: "Politiques, rôles et responsabilités en matière de cybersécurité.",
    questions: [
      {
        id: 'gov-1',
        text: "Une politique de sécurité des systèmes d'information (PSSI) est-elle formalisée, approuvée et diffusée ?",
        help: "La PSSI est le document fondateur de votre démarche de cybersécurité. Elle doit être portée par la direction générale et connue de tous les collaborateurs.",
        options: ["Non", "En cours de rédaction", "Oui, mais pas à jour ou peu diffusée", "Oui, à jour et connue de tous"],
        weight: 3,
      },
      {
        id: 'gov-2',
        text: "Un responsable de la sécurité des systèmes d'information (RSSI) a-t-il été formellement désigné ?",
        help: "Le RSSI est le pilote de la sécurité. Il doit disposer des moyens et de l'autorité nécessaires pour mener à bien ses missions.",
        options: ["Non", "Rôle non exclusif / sans moyens", "Oui, mais sans autorité suffisante", "Oui, avec autorité, équipe et budget"],
        weight: 3,
      },
      {
        id: 'gov-3',
        text: "Une analyse des risques cyber est-elle menée régulièrement ?",
        help: "L'analyse de risques (ex: EBIOS RM) permet d'identifier les menaces et de prioriser les actions de sécurité en fonction de leur impact métier.",
        options: ["Non", "Ponctuellement / sans méthode", "Oui, mais pas à jour", "Oui, intégrée dans les projets et revue annuellement"],
        weight: 2,
      },
      {
        id: 'gov-4',
        text: "Les collaborateurs sont-ils régulièrement sensibilisés aux risques cyber ?",
        help: "La sensibilisation (hameçonnage, mots de passe...) est essentielle car l'humain est souvent le premier maillon faible.",
        options: ["Jamais", "Seulement à l'arrivée", "Campagnes ponctuelles", "Programme de sensibilisation continu et mesuré"],
        weight: 2,
      },
    ],
  },
  // 2. Protection
  {
    title: 'Protection des actifs',
    icon: '💻',
    color: 'bg-green-500',
    description: "Mesures de protection des postes de travail, serveurs et données.",
    questions: [
      {
        id: 'prot-1',
        text: "Les postes de travail et serveurs sont-ils équipés d'antivirus/EDR à jour ?",
        help: "Les solutions antivirus (AV) et Endpoint Detection & Response (EDR) sont la première ligne de défense contre les malwares.",
        options: ["Non ou partiellement", "Oui, mais pas supervisé", "Oui, supervisé mais sans EDR", "Oui, avec EDR et supervision 24/7"],
        weight: 3,
      },
      {
        id: 'prot-2',
        text: "Un système de sauvegarde des données critiques est-il en place et testé ?",
        help: "Les sauvegardes doivent être régulières, externalisées (règle 3-2-1) et leur restauration testée périodiquement pour garantir leur efficacité en cas d'incident (ransomware...).",
        options: ["Non", "Oui, mais non externalisées", "Oui, externalisées mais non testées", "Oui, externalisées et testées régulièrement"],
        weight: 3,
        ugapSuggestion: {
            name: "Sauvegarde Immuable & Cyber Recovery",
            description: "Solution de sauvegarde de dernière génération protégeant contre les ransomwares (copies immuables) avec capacité de restauration instantanée.",
            vendors: ["HPE (StoreOnce/Zerto)", "Rubrik", "Dell (Data Domain)", "Quantum"],
            marketRef: "Marché UGAP Stockage & Sauvegarde"
        }
      },
      {
        id: 'prot-3',
        text: "Les mises à jour de sécurité (correctifs) sont-elles appliquées systématiquement et rapidement ?",
        help: "L'application des correctifs de sécurité sur les systèmes d'exploitation et logiciels est cruciale pour se protéger des failles connues.",
        options: ["Manuellement et rarement", "Manuellement avec retard", "Automatisé mais sans supervision", "Automatisé, supervisé et priorisé selon la criticité"],
        weight: 2,
        ugapSuggestion: {
            name: "Renouvellement Infrastructure Compute",
            description: "Remplacement des serveurs obsolètes par des équipements récents intégrant la sécurité au niveau hardware (Silicon Root of Trust).",
            vendors: ["HPE ProLiant Gen11"],
            marketRef: "Marché UGAP Serveurs"
        }
      },
      {
        id: 'prot-4',
        text: "Les données sensibles sont-elles chiffrées (sur disques, en transit) ?",
        help: "Le chiffrement protège la confidentialité des données en cas de vol de matériel ou d'interception sur le réseau.",
        options: ["Non", "Seulement les postes portables", "Partiellement (postes, certains flux)", "Systématique pour le stockage et les flux sensibles"],
        weight: 2,
        ugapSuggestion: {
            name: "Stockage Sécurisé & Chiffré",
            description: "Baies de stockage Full Flash avec chiffrement natif des données au repos (Data-at-Rest Encryption) sans perte de performance.",
            vendors: ["NetApp", "PureStorage", "HPE Alletra", "Dell PowerStore", "Huawei", "IBM FlashSystem"],
            marketRef: "Marché UGAP Stockage"
        }
      },
    ],
  },
  // 3. Cyber-Résilience (Focus Spécial)
  {
    title: "Cyber-Résilience & Sauvegarde",
    icon: '🛡️',
    color: 'bg-indigo-600',
    description: "Capacité à restaurer les données critiques après une attaque destructrice (Ransomware).",
    questions: [
      {
        id: 'res-1',
        text: "Vos sauvegardes disposent-elles d'une immutabilité (WORM) garantie ?",
        help: "L'immutabilité empêche la modification ou la suppression des sauvegardes, même par un administrateur compromis, bloquant ainsi les ransomwares.",
        options: ["Non", "Partiellement (sur certains partages)", "Oui, via retention logicielle", "Oui, immutabilité matérielle/physique stricte"],
        weight: 3,
        ugapSuggestion: {
            name: "HPE StoreOnce / Dell DataDomain",
            description: "Appliance de déduplication avec verrouillage objet (Object Lock) certifié pour garantir l'intégrité des données.",
            vendors: ["HPE", "Dell", "Quantum"],
            marketRef: "Marché Stockage & Sauvegarde"
        }
      },
      {
        id: 'res-2',
        text: "Disposez-vous d'une copie de sauvegarde déconnectée (Air-gapped) ?",
        help: "Une copie isolée du réseau (physiquement ou logiquement via un 'Virtual Air Gap') est le seul moyen sûr de récupérer ses données si tout le réseau est compromis.",
        options: ["Non, tout est en ligne", "Externalisation sur disque USB/Bande", "Réplication vers un site tiers connecté", "Vault Cyber-Recovery isolé (Air Gap)"],
        weight: 3,
        ugapSuggestion: {
            name: "Architecture Cyber Recovery",
            description: "Solution créant un coffre-fort numérique isolé (Vault) pour analyser et protéger les données critiques hors d'atteinte du réseau principal.",
            vendors: ["Rubrik", "Dell Cyber Recovery", "HPE Zerto"],
            marketRef: "Marché Logiciels Infra"
        }
      },
      {
        id: 'res-3',
        text: "Quelle est la volumétrie totale de données (Back-end) à protéger ?",
        help: "Permet de dimensionner la solution de sauvegarde et d'archivage nécessaire.",
        options: ["< 10 To", "10 - 50 To", "50 - 150 To", "> 150 To"],
        weight: 1, // Poids faible car c'est une question de dimensionnement technique
      },
    ]
  },
    // 4. Contrôle d'accès
  {
    title: "Contrôle des accès",
    icon: '🔑',
    color: 'bg-yellow-500',
    description: "Gestion des comptes, mots de passe et privilèges.",
    questions: [
      {
        id: 'access-1',
        text: "Une politique de mots de passe robuste est-elle appliquée ?",
        help: "Cela inclut la complexité, la longueur minimale (12+ caractères), le non-partage, et l'absence de mots de passe par défaut.",
        options: ["Non", "Recommandations seulement", "Appliquée techniquement mais simple", "Politique ANSSI appliquée (longueur, pas de renouvellement obligé si MFA)"],
        weight: 3,
      },
      {
        id: 'access-2',
        text: "L'authentification multi-facteurs (MFA) est-elle déployée ?",
        help: "La MFA (code SMS, application, clé physique) est une des mesures les plus efficaces pour se protéger contre l'usurpation de comptes.",
        options: ["Non", "Pour les administrateurs seulement", "Pour l'accès externe (VPN, M365)", "Déployée pour tous les accès, internes et externes"],
        weight: 3,
      },
      {
        id: 'access-3',
        text: "Le principe de moindre privilège est-il appliqué pour les comptes utilisateurs ?",
        help: "Chaque utilisateur ne doit avoir que les droits strictement nécessaires à ses missions. Les droits 'administrateur' doivent être très limités.",
        options: ["Non, beaucoup d'admin locaux", "Partiellement, revue manuelle", "Oui, pour les comptes standards", "Oui, avec revue automatisée des droits (Identity Access Management)"],
        weight: 2,
      },
      {
        id: 'access-4',
        text: "Les comptes (arrivées, départs, changements de poste) sont-ils gérés via un processus formalisé ?",
        help: "Un processus clair et outillé est indispensable pour créer, modifier et surtout supprimer les accès rapidement afin d'éviter les comptes orphelins.",
        options: ["Non, gestion manuelle au cas par cas", "Processus manuel mais tracé", "Processus semi-automatisé", "Processus entièrement automatisé et audité"],
        weight: 2,
      },
    ]
  },
  // 4. Sécurité des réseaux
  {
    title: "Sécurité des réseaux",
    icon: '🌐',
    color: 'bg-red-500',
    description: "Cloisonnement, filtrage des flux et protection périmétrique.",
    questions: [
        {
            id: 'net-1',
            text: "Le réseau interne est-il segmenté (cloisonné) ?",
            help: "La segmentation (ex: VLANs) permet de limiter la propagation d'un attaquant sur le réseau. Séparez les serveurs, les postes de travail, le Wi-Fi invités...",
            options: ["Non, réseau plat", "Segmentation de base (ex: Wi-Fi invités)", "Segmentation par zones fonctionnelles", "Micro-segmentation et filtrage strict entre zones"],
            weight: 3,
            ugapSuggestion: {
                name: "HPE Aruba Dynamic Segmentation",
                description: "Segmentation automatisée des ports et des utilisateurs pilotée par le rôle (Colorless Ports) pour contenir les menaces.",
                vendors: ["HPE Aruba Networking", "ClearPass"],
                marketRef: "Marché UGAP LAN"
            }
        },
        {
            id: 'net-2',
            text: "Un pare-feu de nouvelle génération (NGFW) filtre-t-il les flux Internet ?",
            help: "Le NGFW ne se contente pas de filtrer les ports, il analyse les applications et peut détecter les menaces (IPS).",
            options: ["Pas de pare-feu ou box FAI", "Pare-feu simple (stateful)", "NGFW avec fonctions de base", "NGFW avec toutes les fonctions de sécurité activées et supervisées"],
            weight: 3,
            ugapSuggestion: {
                name: "Firewall & SD-WAN Sécurisé",
                description: "Protection périmétrique avancée avec inspection SSL et filtrage applicatif.",
                vendors: ["Stormshield (Qualifié ANSSI)", "Fortinet", "Palo Alto"],
                marketRef: "Marché UGAP Sécurité"
            }
        },
        {
            id: 'net-3',
            text: "Les accès Wi-Fi sont-ils sécurisés ?",
            help: "Le Wi-Fi doit utiliser un chiffrement robuste (WPA2/WPA3-Enterprise), et un portail captif doit être utilisé pour les invités sur un réseau séparé.",
            options: ["Ouvert ou WEP/WPA", "WPA2-Personnel (PSK partagé)", "WPA2-Enterprise (comptes individuels)", "WPA3-Enterprise + sonde de détection de points d'accès illégitimes"],
            weight: 2,
            ugapSuggestion: {
                name: "Wi-Fi Sécurisé Aruba & ClearPass",
                description: "Bornes Wi-Fi 6E/7 avec WPA3 et authentification forte 802.1x via ClearPass pour bloquer les accès non autorisés.",
                vendors: ["HPE Aruba Networking"],
                marketRef: "Marché UGAP WLAN"
            }
        },
        {
            id: 'net-4',
            text: "Les flux administratifs sont-ils réalisés via des postes et réseaux dédiés (bastion) ?",
            help: "L'administration des serveurs et équipements critiques doit se faire depuis des postes sécurisés (PAW - Privileged Access Workstation) via un bastion qui trace toutes les actions.",
            options: ["Non, depuis les postes bureautiques", "Via un VPN mais depuis les postes bureautiques", "Via un bastion mais sans postes dédiés", "Via un bastion et des PAW dédiés"],
            weight: 2,
            ugapSuggestion: {
                name: "Bastion d'Administration (PAM)",
                description: "Traçabilité et enregistrement des sessions d'administration pour éviter les abus de privilèges.",
                vendors: ["Wallix (Qualifié ANSSI)", "CyberArk"],
                marketRef: "Marché UGAP Logiciels"
            }
        },
    ]
  },
  // 5. Détection
  {
    title: "Détection des incidents",
    icon: '📡',
    color: 'bg-purple-500',
    description: "Surveillance, journalisation et corrélation des événements de sécurité.",
    questions: [
      {
        id: 'detect-1',
        text: "La journalisation des événements de sécurité est-elle centralisée ?",
        help: "Centraliser les journaux (logs) des serveurs, pare-feux, antivirus... est un prérequis pour pouvoir détecter et analyser un incident.",
        options: ["Non", "Logs locaux seulement", "Centralisation partielle", "Centralisation complète avec politique de rétention"],
        weight: 3,
      },
      {
        id: 'detect-2',
        text: "Ces journaux sont-ils corrélés et analysés par un système de type SIEM ?",
        help: "Un SIEM (Security Information and Event Management) permet d'analyser en temps réel les journaux pour lever des alertes sur des activités suspectes.",
        options: ["Non", "Analyse manuelle ponctuelle", "SIEM avec règles de base", "SIEM optimisé avec règles personnalisées et 'threat intelligence'"],
        weight: 2,
      },
      {
        id: 'detect-3',
        text: "Une surveillance est-elle externalisée auprès d'un SOC (Security Operations Center) ?",
        help: "Un SOC apporte une expertise et une surveillance 24/7 que peu d'organisations peuvent internaliser.",
        options: ["Non", "Prestation ponctuelle d'audit", "SOC en heures ouvrées", "SOC 24/7 avec capacités de réponse"],
        weight: 2,
      },
      {
        id: 'detect-4',
        text: "Des tests d'intrusion ou des audits de sécurité sont-ils réalisés ?",
        help: "Faire tester régulièrement sa sécurité par des experts externes (pentest) permet de découvrir des failles avant les attaquants.",
        options: ["Jamais", "Rarement (> 2 ans)", "Annuellement sur le périmètre externe", "Annuellement sur périmètres externe et interne"],
        weight: 1,
      },
    ]
  },
  // 6. Réponse
  {
    title: "Réponse aux incidents",
    icon: '🚒',
    color: 'bg-orange-500',
    description: "Processus et moyens pour gérer un incident de sécurité.",
    questions: [
      {
        id: 'resp-1',
        text: "Un processus de gestion des incidents de sécurité est-il défini ?",
        help: "Qui fait quoi en cas d'alerte ? Qui contacter ? Qui décide ? Ce processus doit être clair et connu.",
        options: ["Non", "Informel", "Défini mais non testé", "Défini, testé et intégré dans un contrat de réponse à incident"],
        weight: 3,
      },
      {
        id: 'resp-2',
        text: "Une astreinte de sécurité est-elle en place pour les alertes critiques ?",
        help: "Les attaques n'attendent pas les heures de bureau. Une astreinte (interne ou externe) est nécessaire pour réagir rapidement.",
        options: ["Non", "Astreinte 'au bon vouloir'", "Astreinte formalisée interne", "Astreinte externalisée via un contrat de réponse (CERT/CSIRT)"],
        weight: 2,
      },
      {
        id: 'resp-3',
        text: "L'organisation a-t-elle souscrit une cyber-assurance ?",
        help: "La cyber-assurance peut aider à couvrir les frais liés à un incident (experts, notification, pertes d'exploitation...) mais ne remplace pas les mesures de sécurité.",
        options: ["Non", "En cours d'étude", "Oui, mais avec des garanties faibles", "Oui, avec des garanties adaptées aux risques identifiés"],
        weight: 1,
      },
      {
        id: 'resp-4',
        text: "Des exercices de gestion de crise cyber sont-ils organisés ?",
        help: "Simuler une crise (ex: ransomware) permet d'entraîner les équipes techniques et le comité de direction à prendre les bonnes décisions dans l'urgence.",
        options: ["Non", "Exercice sur table ponctuel", "Exercice technique ponctuel", "Programme annuel d'exercices (technique et direction)"],
        weight: 2,
      },
    ]
  },
    // 7. Continuité
  {
    title: "Continuité d'activité",
    icon: '🔄',
    color: 'bg-teal-500',
    description: "Assurer la reprise des activités critiques après un sinistre majeur.",
    questions: [
      {
        id: 'cont-1',
        text: "Les applications critiques de l'organisme ont-elles été identifiées ?",
        help: "Il s'agit du BIA (Bilan d'Impact sur l'Activité) qui permet de prioriser les efforts de continuité sur ce qui est vraiment vital.",
        options: ["Non", "Liste informelle", "BIA réalisé mais non mis à jour", "BIA formalisé et revu annuellement"],
        weight: 3,
      },
      {
        id: 'cont-2',
        text: "Un Plan de Reprise d'Activité (PRA) informatique a-t-il été formalisé ?",
        help: "Le PRA décrit l'architecture et les procédures techniques pour redémarrer l'informatique sur un site de secours.",
        options: ["Non", "Solutions de secours ponctuelles", "PRA formalisé mais non testé", "PRA formalisé et testé annuellement"],
        weight: 3,
      },
      {
        id: 'cont-3',
        text: "Un Plan de Continuité d'Activité (PCA) a-t-il été formalisé ?",
        help: "Le PCA va au-delà de l'informatique. Il décrit les procédures 'métiers' dégradées (formulaires papier, etc.) en cas de panne du SI.",
        options: ["Non", "Procédures informelles", "PCA formalisé mais non testé", "PCA formalisé et testé annuellement avec les métiers"],
        weight: 2,
      },
      {
        id: 'cont-4',
        text: "Le PRA est-il hébergé sur un site géographiquement distant ?",
        help: "En cas de sinistre majeur (inondation, incendie...), le site de secours doit être suffisamment éloigné pour ne pas être impacté.",
        options: ["Pas de site de secours", "Dans le même bâtiment", "Dans la même ville", "Site distant de plusieurs dizaines de kilomètres"],
        weight: 2,
      },
    ]
  },
];

// BENCHMARKS SECTORIELS
export const BENCHMARKS: Benchmarks = {
  'Collectivité territoriale': {
    avgMaturity: 45,
    topRisks: ["Ransomware", "Hameçonnage (Phishing)", "Fuite de données"],
    description: "Benchmark basé sur les collectivités territoriales de taille similaire."
  },
  'Ministère': {
    avgMaturity: 65,
    topRisks: ["Espionnage étatique", "Attaques ciblées (APT)", "Déni de service"],
    description: "Benchmark basé sur les données des ministères et agences centrales."
  },
  'Établissement public': {
    avgMaturity: 50,
    topRisks: ["Fraude au président", "Ransomware", "Vol de propriété intellectuelle"],
    description: "Benchmark pour les établissements publics et opérateurs de l'État."
  },
  'Agence d\'État': {
    avgMaturity: 55,
    topRisks: ["Ransomware", "Déni de service", "Attaques sur la chaîne d'approvisionnement"],
    description: "Benchmark pour les agences et opérateurs spécialisés."
  },
  'Préfecture': {
    avgMaturity: 52,
    topRisks: ["Hameçonnage ciblé", "Fuite de données personnelles", "Ransomware"],
    description: "Benchmark pour les services déconcentrés de l'État."
  },
  'Autre': {
    avgMaturity: 48,
    topRisks: ["Ransomware", "Hameçonnage (Phishing)", "Vol de données"],
    description: "Benchmark moyen tous secteurs publics confondus."
  }
};

// BUDGET ITEMS
export const BUDGET_ITEMS: BudgetItems = {
  // Gouvernance
  'gov-1': { name: "Accompagnement rédaction PSSI", phase: 0, cost: 5000, description: "Ateliers et rédaction de la politique de sécurité avec un consultant." },
  'gov-2': { name: "Prestation RSSI temps partagé", phase: 0, cost: 15000, description: "Mission de conseil annuelle pour piloter la sécurité (2 jours/mois)." },
  'gov-3': { name: "Analyse de risques EBIOS RM", phase: 1, cost: 8000, description: "Analyse de risques sur un périmètre critique avec un consultant certifié." },
  'gov-4': { name: "Plateforme de sensibilisation", phase: 0, cost: 3000, description: "Licence annuelle pour une plateforme de e-learning et campagnes de phishing." },
  // Protection
  'prot-1': { name: "Déploiement EDR souverain", phase: 0, cost: 4000, description: "Licences annuelles pour une solution EDR (ex: Tehtris, HarfangLab).", anssiCertified: true },
  'prot-2': { name: "Solution de sauvegarde externalisée", phase: 0, cost: 6000, description: "Coût annuel pour une solution de sauvegarde cloud immuable." },
  'prot-3': { name: "Outil de gestion des vulnérabilités", phase: 1, cost: 7000, description: "Licence annuelle pour un scanner de vulnérabilités et gestion des correctifs." },
  'prot-4': { name: "Solution de chiffrement de données", phase: 2, cost: 3500, description: "Licence pour le chiffrement centralisé des postes et serveurs." },
  // Contrôle d'accès
  'access-1': { name: "Gestionnaire de mots de passe d'entreprise", phase: 0, cost: 2000, description: "Licence annuelle pour une solution de coffre-fort de mots de passe." },
  'access-2': { name: "Déploiement MFA", phase: 0, cost: 2500, description: "Licences annuelles et support pour une solution d'authentification forte." },
  'access-3': { name: "Projet de gestion des identités (IAM)", phase: 2, cost: 25000, description: "Projet d'intégration d'une solution IAM pour automatiser la gestion des droits." },
  'access-4': { name: "Audit des comptes à privilèges", phase: 1, cost: 4000, description: "Mission de conseil pour cartographier et rationaliser les comptes administrateurs." },
  // Sécurité des réseaux
  'net-1': { name: "Projet de segmentation réseau", phase: 1, cost: 12000, description: "Prestation d'architecture et de configuration pour le cloisonnement du réseau." },
  'net-2': { name: "NGFW souverain en haute disponibilité", phase: 0, cost: 18000, description: "Achat et installation d'une paire de pare-feux (ex: Stormshield).", anssiCertified: true },
  'net-3': { name: "Solution de contrôle d'accès réseau (NAC)", phase: 2, cost: 9000, description: "Licences et prestation pour une solution de contrôle d'accès 802.1x." },
  'net-4': { name: "Déploiement d'un bastion d'administration", phase: 1, cost: 10000, description: "Licence et intégration d'une solution de PAM (ex: Wallix).", anssiCertified: true },
  // Détection
  'detect-1': { name: "Mise en place d'un SIEM", phase: 1, cost: 20000, description: "Licence et projet d'intégration d'un SIEM pour la centralisation des logs." },
  'detect-2': { name: "Abonnement Threat Intelligence", phase: 2, cost: 5000, description: "Flux de renseignement sur les menaces pour enrichir le SIEM." },
  'detect-3': { name: "Contrat SOC externalisé", phase: 1, cost: 25000, description: "Abonnement annuel à un service de supervision de sécurité 24/7." },
  'detect-4': { name: "Test d'intrusion annuel", phase: 0, cost: 7500, description: "Prestation annuelle de pentest sur le périmètre externe." },
  // Réponse
  'resp-1': { name: "Rédaction plan de réponse à incident", phase: 0, cost: 4000, description: "Ateliers et rédaction des procédures de gestion d'incident." },
  'resp-2': { name: "Contrat de réponse à incident (Retainer)", phase: 0, cost: 10000, description: "Contrat annuel avec un CERT/CSIRT pour une assistance garantie en cas de crise." },
  'resp-3': { name: "Souscription cyber-assurance", phase: 2, cost: 6000, description: "Prime annuelle pour une police d'assurance cyber." },
  'resp-4': { name: "Exercice de crise cyber", phase: 1, cost: 9000, description: "Organisation d'une simulation de crise avec les équipes IT et le CODIR." },
  // Continuité
  'cont-1': { name: "Réalisation d'un BIA", phase: 0, cost: 6000, description: "Ateliers avec les métiers pour évaluer l'impact des pannes et définir les RTO/RPO." },
  'cont-2': { name: "Mise en place d'un PRA managé", phase: 1, cost: 30000, description: "Coût annuel pour une solution de reprise d'activité dans un datacenter tiers." },
  'cont-3': { name: "Accompagnement rédaction PCA", phase: 2, cost: 7000, description: "Ateliers avec les métiers pour formaliser les procédures dégradées." },
  'cont-4': { name: "Test annuel du PRA", phase: 1, cost: 5000, description: "Prestation pour organiser et piloter le test de bascule annuel du PRA." },
};

// ANSSI SOLUTIONS CATALOG
export const ANSSI_SOLUTIONS: AnssiSolutionCategory[] = [
  {
    domain: 'Gouvernance, Audit & Conseil',
    icon: '🏛️',
    description: "Services d'accompagnement pour définir votre stratégie, évaluer vos risques et auditer votre conformité.",
    solutions: [
      { name: "Assistance et conseil (PACS)", provider: "Ex: Intrinsec Sécurité, Holiseum", description: "Aide à la sécurisation et au maintien en condition de sécurité des SI." },
      { name: "Audit de la sécurité (PASSI)", provider: "Ex: Orange Cyberdefense, Amossys, Wavestone", description: "Évaluation impartiale de la conformité d'un SI à des critères d'audit." },
    ],
  },
  {
    domain: 'Protection des Postes & Serveurs',
    icon: '💻',
    description: "Solutions pour protéger les terminaux contre les malwares et les menaces avancées (EDR, antivirus, chiffrement).",
    solutions: [
      { name: "Systèmes de détection (EDR)", provider: "Ex: Harfanglab EDR", description: "Détection et réponse aux menaces sur les postes de travail et serveurs." },
      { name: "Chiffrement de fichiers et disques", provider: "Ex: Prim'X (ZoneCentral, Cryhod)", description: "Protection de la confidentialité des données stockées." },
    ],
  },
  {
    domain: 'Contrôle des Accès & Identité',
    icon: '🔑',
    description: "Services et produits pour vérifier l'identité des utilisateurs et gérer leurs droits d'accès au système d'information.",
    solutions: [
      { name: "Vérification d'identité à distance (PVID)", provider: "Ex: Docaposte, Idnow, Namirial", description: "Preuve d'identité en ligne pour l'accès à des services." },
      { name: "Dispositifs de création de signature", provider: "Ex: Idemia France, Austria Card", description: "Composants sécurisés pour la signature électronique (cartes, puces)." },
    ],
  },
  {
    domain: 'Sécurité des Réseaux',
    icon: '🌐',
    description: "Équipements pour filtrer les flux, cloisonner les réseaux et se protéger des attaques venant d'Internet.",
    solutions: [
      { name: "Pare-feu (Firewall)", provider: "Ex: Stormshield Network Security", description: "Filtrage des flux réseaux et prévention d'intrusions." },
      { name: "TAP réseau", provider: "Ex: Allentis, Gatewatcher", description: "Capture du trafic pour l'analyse par des sondes de détection." },
    ],
  },
  {
    domain: 'Détection & Réponse aux Incidents',
    icon: '📡',
    description: "Services opérés (SOC) pour surveiller, détecter, analyser et répondre aux incidents de sécurité 24/7.",
    solutions: [
      { name: "Détection d'incidents (PDIS)", provider: "Ex: Airbus Protect, Advens, Orange Cyberdefense", description: "Supervision en temps réel pour détecter les activités anormales." },
      { name: "Réponse aux incidents (PRIS)", provider: "Ex: Wavestone, Lexfo, Sopra Steria", description: "Investigation et remédiation suite à un incident de sécurité avéré." },
    ],
  },
  {
    domain: 'Cloud de Confiance (SecNumCloud)',
    icon: '☁️',
    description: "Services d'informatique en nuage (IaaS, PaaS, SaaS) offrant les plus hautes garanties de sécurité et de confiance, recommandés par l'État.",
    solutions: [
      { name: "Infrastructure as a Service (IaaS)", provider: "Ex: Outscale, OVHcloud, Cloud Temple", description: "Hébergement de machines virtuelles et stockage sur une infrastructure sécurisée." },
      { name: "Platform as a Service (PaaS)", provider: "Ex: Cloud Temple (PaaS Openshift)", description: "Plateformes pour développer et déployer des applications." },
    ],
  }
];

// GLOSSAIRE
export const GLOSSARY: { [term: string]: string } = {
    "Air-Gap": "Mesure de sécurité consistant à isoler physiquement ou logiquement un réseau ou une sauvegarde de tout autre réseau (y compris Internet), pour le rendre inaccessible aux attaquants distants.",
    "ANSSI": "Agence Nationale de la Sécurité des Systèmes d'Information. L'autorité nationale en matière de sécurité et de défense des systèmes d'information en France.",
    "BIA (Bilan d'Impact sur l'Activité)": "Analyse permettant d'identifier les processus métiers critiques et d'estimer les impacts (financiers, image, légaux...) d'une interruption de service.",
    "EDR (Endpoint Detection & Response)": "Technologie de sécurité installée sur les postes et serveurs pour détecter et bloquer les cyberattaques avancées (ransomwares, virus inconnus) que les antivirus classiques ne voient pas.",
    "Immutabilité (WORM)": "Propriété d'un stockage garantissant que les données, une fois écrites, ne peuvent être ni modifiées ni supprimées pendant une durée définie (Write Once, Read Many). Essentiel contre les ransomwares.",
    "MFA (Authentification Multi-Facteurs)": "Méthode d'authentification demandant au moins deux preuves d'identité distinctes (ex: mot de passe + code SMS/Appli), rendant le vol de mot de passe inefficace.",
    "NGFW (Next-Generation Firewall)": "Pare-feu de nouvelle génération capable d'analyser le contenu des connexions (applications, fichiers) et non plus seulement les ports réseaux, pour bloquer les menaces.",
    "PCA / PRA": "Plan de Continuité / Reprise d'Activité. Ensemble des procédures permettant de maintenir (PCA) ou de redémarrer (PRA) l'activité d'une organisation après un sinistre majeur.",
    "PSSI": "Politique de Sécurité des Systèmes d'Information. Document stratégique définissant les règles et objectifs de sécurité de l'organisme.",
    "Ransomware (Rançongiciel)": "Logiciel malveillant qui chiffre les données de la victime et exige une rançon pour fournir la clé de déchiffrement.",
    "RGPD": "Règlement Général sur la Protection des Données. Loi européenne encadrant le traitement des données personnelles et imposant leur sécurisation.",
    "Risk-Based Authentication": "Authentification adaptative qui renforce les contrôles (MFA, blocage) en fonction du niveau de risque détecté (nouvel appareil, pays inhabituel...).",
    "Roots of Trust (Silicon)": "Technologies de sécurité intégrées directement dans le matériel (processeur, carte mère) pour garantir que le système n'a pas été compromis avant même le démarrage de l'OS.",
    "SIEM": "Security Information and Event Management. Outil collectant et analysant en temps réel les journaux (logs) de tout le SI pour détecter des incidents de sécurité.",
    "SOC (Security Operations Center)": "Centre opérationnel de sécurité regroupant équipes, processus et outils pour surveiller et défendre le SI 24h/24 et 7j/7.",
    "VLAN (Segmentation)": "Technique réseau permettant de créer des sous-réseaux logiques distincts sur une même infrastructure physique, pour isoler les flux et limiter la propagation des attaques."
};
