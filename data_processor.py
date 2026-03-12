import scanpy as sc
import json
import os
import numpy as np

def get_gene_data(adata, gene_name):
    """FORCES extraction from raw (unscaled) backup first."""
    
    # 1. Check the RAW backup first (this has the 0 to 5 positive numbers)
    if adata.raw is not None and gene_name in adata.raw.var_names:
        raw_data = adata.raw[:, gene_name].X #slices the spreadsheet to get all rows (cells), but only the column for the gene name X (i.e., C3DE, returns to me all cells and their CD3E levels (returns 0 if none))
        print(f"💎 Using RAW data for {gene_name}") # Optional debug line

    # 2. Fallback to main data ONLY if it's not in raw
    elif gene_name in adata.var_names:
        raw_data = adata[:, gene_name].X
        print(f"⚠️ Using SCALED data for {gene_name}")

    else:
        return [0.0] * adata.n_obs

    # Conversion logic stays the same
    if hasattr(raw_data, "toarray"): #checks if data is in sparse mode. sparse mode only stores numbers that arent 0, to make it more efficient. value 1 would be 3, value 4 would then be 5. when filling out the zeros upon decompression, .toarray() fills in value 2 and 3 with 0's. if so....
        return raw_data.toarray().flatten().tolist()  #converts sparse format to a regular list of numbers (ie, 0's are filled in rather thanbeing compresse sparse objects), turns a 2D matrix into a 1D list, converts from a python numpy array to a standard JS-style Array
    return raw_data.flatten().tolist()


def generate_cell_json():
    print("🧬 Loading Human PBMC dataset...")
    adata = sc.datasets.pbmc3k_processed() #adata - annotated data. adata.X is a giant matrix of numbers. adata.obs has information about the cells (this cell is a T cell), adata.var contains info about genes (this gene is CD3E), adata.obsm is observation metadata - this is where X and Y coordinates live

    print("📊 Extracting coordinates and markers...")
    umap_coords = adata.obsm['X_umap'] #X-umap is an array or coordinates in which each pair is a coordinate for a single cell [[x,y], [x,y]...]. these x,y coordinates represent how similar one cell is to another. if two cells have almost identical gene activity, UMAP gives them coordinates that are very close to eachother (e.g., [1.2, 5.0] and [1.3, 5.1]). they exist in a latent space - imaginary 2D graph
    
    # In this dataset, 'louvain' is the column name for cell types
    cell_types = adata.obs['louvain'].astype(str).tolist() #a list of every cell's "metadata" (e.g., Cell #1 ia a T-cell, Cell #2 is from patient A)
    

    target_genes = [
        "PPBP", "PF4", "GNG11",          # Megakaryocytes
        "CD19", "MS4A1", "CD79A",        # B Cells
        "FCER1A", "HLA-DRA",             # Dendritic Cells
        "CD14", "LYZ", "S100A8",         # Monocytes (Classical)
        "FCGR3A",                        # Monocytes (Non-classical) / NK
        "GNLY", "NKG7",                  # NK Cells
        "CD3E", "CD3D", "CD4", "CD8A"    # T Cells
    ]
    gene_payloads = {gene: get_gene_data(adata, gene) for gene in target_genes}

    cells = []
    for i in range(len(cell_types)):
        cells.append({
            "id": i, #give each one an id 
            "x": float(umap_coords[i][0]), #for each cell, get its x coordinate (position 0 in [x,y]) and y coordinate (position 1 in [x, y])
            "y": float(umap_coords[i][1]),
            "type": cell_types[i], #get the cell's metadata
            "genes": {gene: round(float(gene_payloads[gene][i]), 2) for gene in target_genes}, #round the amount of cd3e expressed to two decimal points (ie, 2.42)
        })

    output_dir = 'public'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(f'{output_dir}/cells.json', 'w') as f:
        json.dump(cells, f)
    
    print(f"✅ Success! Created {output_dir}/cells.json with {len(cells)} cells.")

if __name__ == "__main__": #python best practice - only run this code if i run this file specifically (prevents code from running accidentally if tou imported a function from this file into another file)
    generate_cell_json()