export function getVoortgang() {
  if (typeof window === "undefined") return null
  const data = sessionStorage.getItem("voortgang_leren")
  return data ? JSON.parse(data) : null
}

export function markeerCategorieGelezen(categorie: string) {
  const data = getVoortgang() || { voertuig: "auto", gelezen: {} }
  data.gelezen[categorie] = true
  sessionStorage.setItem("voortgang_leren", JSON.stringify(data))
}