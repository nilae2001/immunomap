# 🧬 ImmunoMap v4.0
### **High-Resolution Single-Cell Transcriptomics Explorer**

**ImmunoMap** is an interactive manifold explorer designed to visualize the transcriptomic landscape of Peripheral Blood Mononuclear Cells (PBMCs). It bridges the gap between static bioinformatics pipelines and real-time data exploration, allowing researchers to validate cellular identities through dynamic lineage marker analysis.

---

## 🚀 The Core Engine

### **Bioinformatics Pipeline**
The underlying data was processed via a custom **Scanpy** pipeline in an **Anaconda** environment:
* **Quality Control:** Filtered for mitochondrial gene percentage and n_genes to remove dead cells and doublets.
* **Normalization:** Log-normalized and scaled to 10k counts per cell.
* **Dimensionality Reduction:** Principal Component Analysis (PCA) followed by **UMAP** (Uniform Manifold Approximation and Projection) for global topological preservation.

### **Frontend Architecture**
* **D3-Quadtree Indexing:** Implemented spatial partitioning to handle sub-millisecond hover detection across thousands of data points.
* **High-DPI Canvas Rendering:** Custom scaling logic to ensure ultra-sharp visualization on Retina/4K displays.
* **Mantine UI:** A professional-grade component library for an "Intelligence System" aesthetic.

---

## 🧬 Biological Lineage Panel

The system tracks an expanded suite of **canonical markers** to resolve the PBMC landscape:

| Lineage | Key Markers | Biological Identity |
| :--- | :--- | :--- |
| **T Cells** | `CD3E`, `CD3D`, `CD4`, `CD8A` | Pan-T, Helper, and Cytotoxic subsets |
| **B Cells** | `CD19`, `MS4A1`, `CD79A` | B-cell receptor complex & maturation |
| **Monocytes** | `CD14`, `LYZ`, `S100A8` | Classical and inflammatory myeloid cells |
| **NK Cells** | `GNLY`, `NKG7`, `FCGR3A` | Cytolytic effector cells (Natural Killer) |
| **Dendritic** | `FCER1A`, `HLA-DRA` | Professional antigen-presenting cells |
| **Megakaryocytes** | `PPBP`, `PF4`, `GNG11` | Platelet progenitors (Rare populations) |

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Mantine UI, TailwindCSS
* **Visualization:** HTML5 Canvas, D3.js (Quadtree)
* **Data Science:** Python, Scanpy, Pandas, NumPy
* **Environment:** Anaconda / Conda

---

## ⚡ Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/nilae2001/immunomap.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run Dev Environment**
   ```bash
   npm run dev
   ```

---

## 🧪 Scientific Logic

In single-cell analysis, clusters can often be ambiguous. By providing a Dual-Gene Comparison tool and Dynamic Thresholding, ImmunoMap allows users to distinguish between:

1. **Transitional States:** Identifying NKT cells (`CD3E+` & `GNLY+`).
2. **Cluster Purity:** Validating that a cluster exclusively expresses its expected lineage markers.
3. **Doublet Detection:** Catching technical artifacts where two different cell types share a single coordinate.

---

## 🔗 Links

* **Live Demo:** [nilaerturk.com/immunomap](https://nilaerturk.com/immunomap)
* **Portfolio:** [nilaerturk.com](https://nilaerturk.com)
