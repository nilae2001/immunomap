export const getIdentity = (genes: Record<string, number>) => {
  const t = 0.5;

  // 1. megakaryocytes
  if (genes["PPBP"] > t || genes["PF4"] > t)
    return {
      name: "Megakaryocytes",
      color: "pink",
      reason: "Platelet markers detected",
    };

  // 2. b-lymphocytes (strict check)
  if (genes["MS4A1"] > t || genes["CD19"] > t || genes["CD79A"] > t) {
    return {
      name: "B-Lymphocytes",
      color: "blue",
      reason: "Found CD19/MS4A1/CD79A B-lineage markers",
    };
  }

  // 3. dendritic cells (the "finicky" logic)
  // must be an APC (HLA-DRA) but NOT a B-cell (already checked) and NOT a Monocyte (LYZ check)
  const isDendritic =
    genes["FCER1A"] > 0.3 ||
    (genes["HLA-DRA"] > 1.8 && genes["LYZ"] < 0.8 && genes["S100A8"] < 0.8);

  if (isDendritic) {
    return {
      name: "Dendritic Cells",
      color: "yellow",
      reason:
        genes["FCER1A"] > 0.3
          ? "Specific FCER1A marker present"
          : "High HLA-DRA APC signal with low Monocyte markers",
    };
  }

  // 4. monocytes
  if (genes["CD14"] > t || genes["LYZ"] > 1.2 || genes["S100A8"] > 1.2) {
    return {
      name: "Monocytes",
      color: "orange",
      reason: "High myeloid/monocyte markers (LYZ/S100A8)",
    };
  }

  // 5. nk Cells
  const nkScore = (genes["NKG7"] > t ? 1 : 0) + (genes["GNLY"] > t ? 1 : 0);
  if (nkScore >= 2 && (genes["CD3E"] || 0) < t) {
    return {
      name: "NK Cells",
      color: "purple",
      reason: "NK cytotoxic markers found without CD3 expression",
    };
  }

  // 6. t-Lymphocytes (The "purified" check)
  // only classify as T if it has T markers AND isn't showing B/Myeloid signals
  if (genes["CD3E"] > t || genes["CD3D"] > t) {
    const isActuallyT = genes["MS4A1"] < t && genes["LYZ"] < 1.0;

    if (!isActuallyT)
      return {
        name: "Unknown Identity",
        color: "gray",
        reason: "Conflicting T and B/Myeloid signals (possible doublet)",
      };

    if ((genes["CD4"] || 0) > (genes["CD8A"] || 0) && (genes["CD4"] || 0) > t)
      return {
        name: "CD4+ T-Lymphocytes",
        color: "teal",
        reason: "CD3+ with strong CD4+ helper signal",
      };
    if ((genes["CD8A"] || 0) > (genes["CD4"] || 0) && (genes["CD8A"] || 0) > t)
      return {
        name: "CD8+ T-Lymphocytes",
        color: "cyan",
        reason: "CD3+ with strong CD8+ cytotoxic signal",
      };

    return {
      name: "T-Lymphocytes",
      color: "teal",
      reason: "General CD3/CD2 signal detected",
    };
  }

  return {
    name: "Unknown Identity",
    color: "gray",
    reason: "No strong lineage markers detected",
  };
};
