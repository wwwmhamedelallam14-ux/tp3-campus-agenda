
import React from "react";
import {
  View, Text, FlatList, StyleSheet, SafeAreaView} from "react-native";
import { StatusBar } from "expo-status-bar";

type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: "E01", titre: "Atelier React", categorie: "Atelier", capacite: 25, inscrits: 25 },
  { id: "E02", titre: "Conférence IA", categorie: "Conférence", capacite: 70, inscrits: 52 },
  { id: "E03", titre: "Sécurité mobile", categorie: "Atelier", capacite: 20, inscrits: 17 },
  { id: "E04", titre: "Design UI", categorie: "Atelier", capacite: 18, inscrits: 9 },
  { id: "E05", titre: "Forum projets", categorie: "Rencontre", capacite: 50, inscrits: 49 },
  { id: "E06", titre: "Découverte Git", categorie: "Atelier", capacite: 24, inscrits: 24 }
];

function placesRestantes(e: Evenement): number {
  let places = e.capacite - e.inscrits;

  if (places < 0) {
    return 0;
  } else {
    return places;
  }
}

function statutEvenement(e: Evenement): string {
  let places = placesRestantes(e);
  if (places === 0) {
    return "Complet";
  } else if (places <= 3) {
    return "Presque complet";
  } else {
    return "Ouvert";
  }
}

const nombreTotal = evenements.length;

const nombreComplets = evenements.filter(
  e => placesRestantes(e) === 0
).length;

const nombreAvecPlaces = evenements.filter(
  e => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

const ateliersDisponibles = evenements.filter(e => {
  if (e.categorie === "Atelier" && placesRestantes(e) > 0) {
    return true;
  } else {
    return false;
  }
});

function BadgeEtat({ statut }: { statut: string }) {
  let couleur = "#D1FAE5";

  if (statut === "Complet") {
    couleur = "#FECACA";
  } else if (statut === "Presque complet") {
    couleur = "#FED7AA";
  }

  return (
    <View style={[styles.badge, { backgroundColor: couleur }]}>
      <Text style={styles.badgeText}>{statut}</Text>
    </View>
  );
}

function CarteEvenement({ evenement }: { evenement: Evenement }) {
  return (
    <View style={styles.carte}>
      <Text style={styles.titre}>{evenement.titre}</Text>
      <Text style={styles.info}>Catégorie : {evenement.categorie}</Text>
      <Text style={styles.info}>
        Places restantes : {placesRestantes(evenement)}
      </Text>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

function BlocStatistique({
  libelle,
  valeur
}: {
  libelle: string;
  valeur: number;
}) 
{
  return (
    <View style={styles.statistique}>
      <Text style={styles.libelle}>{libelle}</Text>
      <Text style={styles.nombre}>{valeur}</Text>
    </View>
  );
}

export default function App() {
  
  const mode = "tous";

  let listeAffichee = evenements;

  if (mode === "ateliers") {
    listeAffichee = ateliersDisponibles;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CampusAgenda</Text>
        <Text style={styles.headerSubtitle}>C'est mon Interface</Text>
      </View>
      <View style={styles.statsRow}>
        <BlocStatistique libelle="Événements" valeur={nombreTotal} />
        <BlocStatistique libelle="Complets" valeur={nombreComplets} />
        <BlocStatistique libelle="Avec places" valeur={nombreAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
      </View>
      <Text style={styles.modeTitle}>
        {mode === "tous" ? "Tous les événements" : "Ateliers disponibles"}
      </Text>

      <FlatList
        data={listeAffichee}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Aucun événement à afficher.
          </Text>
        }

        contentContainerStyle={styles.list}/>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FD"
  },
  header: {
    backgroundColor: "#003796",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#DBEAFE",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
   
  },
  statistique: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  libelle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center"
  },
  nombre: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#003796",
    marginTop: 5
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003796",
    marginHorizontal: 15,
    marginTop: 8,
    marginBottom: 5
  },
  list: {
    paddingBottom: 20,
    flexGrow: 1
  },
  carte: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 12
  },
  titre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 6
  },
  info: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4
  },
  badge: {
    padding: 7,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start"
  },
  badgeText: {
    fontWeight: "bold",
    color: "#1E293B"
  },
  empty: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 16,
    marginTop: 30
  }
});
