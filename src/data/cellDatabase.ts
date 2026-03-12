export const cellDatabase: Record<string, { desc: string; function: string }> =
  {
    "T-Lymphocytes": {
      desc: "The 'Command and Combat' units of adaptive immunity.",
      function:
        "They coordinate immune responses and destroy infected cells using antigen recognition.",
    },

    "B-Lymphocytes": {
      desc: "The 'Antibody Architects'.",
      function:
        "They produce antibodies that recognize pathogens and provide long-term immune memory.",
    },

    Monocytes: {
      desc: "The 'Rapid Response' scavengers.",
      function:
        "They circulate in blood, engulf pathogens, and can develop into macrophages or dendritic cells.",
    },

    "NK Cells": {
      desc: "The 'Natural Killer' special forces.",
      function:
        "They rapidly destroy virus-infected or cancerous cells without prior antigen exposure.",
    },

    "Dendritic Cells": {
      desc: "The 'Information Messengers'.",
      function:
        "They capture pathogens and present antigens to T cells to initiate adaptive immunity.",
    },

    Megakaryocytes: {
      desc: "The 'Platelet Factories'.",
      function:
        "Large bone marrow cells that release platelets to help blood clot and repair vessels.",
    },
  };
