const MAX_STRING_LENGTH = 100;
const MAX_SIZE_LENGTH = 20;

// Validation functions
const validators = {
    boolean: (value) => {
        if (typeof value === 'string') {
            const lowercased = value.toLowerCase();
            return lowercased === 'true' || lowercased === 'false';
        }
        return typeof value === 'boolean';
    },

    string: (value, maxLength = MAX_STRING_LENGTH) =>
        typeof value === 'string' && value.length <= maxLength,

    enum: (allowedValues) => (value) => {
        if (typeof value !== 'string') return false;
        return allowedValues.includes(value.toLowerCase());
    },

    size: (value, maxLength = MAX_SIZE_LENGTH) => {
        if (typeof value !== 'string') return false;
        // Validate format like "800x600" or "100%x200"
        return value.length <= maxLength && /^(\d+%?|\d+)x(\d+%?|\d+)$/i.test(value);
    },

    number: (value, min = 0, max = 10000, integerOnly = false) => {
        if (typeof value !== 'string' && typeof value !== 'number') return false;
        const num = Number(value);
        if (Number.isNaN(num) || num < min || num > max) return false;
        return !(integerOnly && !Number.isInteger(num));
    }
};

// Diagram type configurations
export const diagramConfigs = {
    blockdiag: {
        options: {
            'antialias': { validator: validators.boolean },
            'no-transparency': { validator: validators.boolean },
            'size': { validator: validators.size },
            'no-doctype': { validator: validators.boolean },
        }
    },

    seqdiag: {
        options: {
            'antialias': { validator: validators.boolean },
            'no-transparency': { validator: validators.boolean },
            'size': { validator: validators.size },
            'no-doctype': { validator: validators.boolean },
        }
    },

    actdiag: {
        options: {
            'antialias': { validator: validators.boolean },
            'no-transparency': { validator: validators.boolean },
            'size': { validator: validators.size },
            'no-doctype': { validator: validators.boolean },
        }
    },

    nwdiag: {
        options: {
            'antialias': { validator: validators.boolean },
            'no-transparency': { validator: validators.boolean },
            'size': { validator: validators.size },
            'no-doctype': { validator: validators.boolean },
        }
    },

    packetdiag: {
        options: {
            'antialias': { validator: validators.boolean },
            'no-transparency': { validator: validators.boolean },
            'size': { validator: validators.size },
            'no-doctype': { validator: validators.boolean },
        }
    },

    rackdiag: {
        options: {
            'antialias': { validator: validators.boolean },
            'no-transparency': { validator: validators.boolean },
            'size': { validator: validators.size },
            'no-doctype': { validator: validators.boolean },
        }
    },

    d2: {
        options: {
            'theme': {
                validator: validators.enum([
                    'default',
                    'neutral-gray', 
                    'flagship-terrastruct', 
                    'cool-classics', 
                    'mixed-berry-blue',
                    'grape-soda', 
                    'aubergine', 
                    'colorblind-clear', 
                    'vanilla-nitro-cola', 
                    'orange-creamsicle',
                    'shirley-temple', 
                    'earth-tones', 
                    'everglade-green', 
                    'buttered-toast', 
                    'dark-mauve', 
                    'terminal', 
                    'terminal-grayscale'
                ])
            },
            'layout': {
                validator: validators.enum(['dagre', 'elk', 'tala'])
            },
            'sketch': { validator: validators.boolean }
        }
    },

    ditaa: {
        options: {
            'no-antialias': { validator: validators.boolean },
            'no-separation': { validator: validators.boolean },
            'round-corners': { validator: validators.boolean },
            'scale': { validator: (v) => validators.number(v, 0.1, 5) },
            'no-shadows': { validator: validators.boolean },
            'tabs': { validator: (v) => validators.number(v, 1, 24, true) },
        }
    },  
    
    graphviz: {
        options: {
            'layout': { validator: validators.enum(['dot', 'neato', 'fdp', 'sfdp', 'twopi', 'circo', 'nop', 'nop2', 'osage', 'patchwork']) },
            'scale': { validator: (v) => validators.number(v, 0.1, 500) }
        },
        // Prefix-based options that match patterns like:
        // - graph-attribute-bgcolor, graph-attribute-dpi, graph-attribute-rankdir
        // - node-attribute-shape, node-attribute-fillcolor, node-attribute-style
        // - edge-attribute-color, edge-attribute-style, edge-attribute-penwidth
        // See: https://graphviz.org/docs/graph/, https://graphviz.org/docs/nodes/, https://graphviz.org/docs/edges/
        prefixOptions: {
            'graph-attribute-': { validator: (v) => validators.string(v, 200) },
            'node-attribute-': { validator: (v) => validators.string(v, 200) },
            'edge-attribute-': { validator: (v) => validators.string(v, 200) }
        }
    },  
    
    mermaid: {
        options: {
            'theme': { validator: validators.enum(['default', 'base', 'dark', 'forest', 'neutral']) },
            'theme-variables': { validator: (v) => validators.string(v, 500) },
            'theme-css': { validator: (v) => validators.string(v, 1000) },
            'look': { validator: validators.enum(['classic', 'handdrawn']) },
            'hand-drawn-seed': { validator: (v) => validators.number(v, 0) },
            'layout': { validator: validators.enum(['dagre', 'elk']) },
            'max-edges': { validator: (v) => validators.number(v, 0, 9999) },
            'dark-mode': { validator: validators.boolean },
            'html-labels': { validator: validators.boolean },
            'font-family': { validator: (v) => validators.string(v, 200) },
            'arrow-marker-absolute': { validator: validators.boolean },
            'legacy-math-ml': { validator: validators.boolean },
            'force-legacy-math-ml': { validator: validators.boolean },
            'deterministic-ids': { validator: validators.boolean },
            'deterministic-id-seed': { validator: (v) => validators.string(v, 200) },
            'wrap': { validator: validators.boolean },
            'font-size': { validator: (v) => validators.number(v, 1, 120, true) },
            'markdown-auto-wrap': { validator: validators.boolean },
        },
        prefixOptions: {
            'elk_': { validator: (v) => validators.string(v, 1000) },
            'flowchart_': { validator: (v) => validators.string(v, 1000) },
            'sequence_': { validator: (v) => validators.string(v, 1000) },
            'gantt_': { validator: (v) => validators.string(v, 1000) },
            'journey_': { validator: (v) => validators.string(v, 1000) },
            'timeline_': { validator: (v) => validators.string(v, 1000) },
            'class_': { validator: (v) => validators.string(v, 1000) },
            'state_': { validator: (v) => validators.string(v, 1000) },
            'er_': { validator: (v) => validators.string(v, 1000) },
            'pie_': { validator: (v) => validators.string(v, 1000) },
            'quadrant-chart_': { validator: (v) => validators.string(v, 1000) },
            'xy-chart_': { validator: (v) => validators.string(v, 1000) },
            'requirement_': { validator: (v) => validators.string(v, 1000) },
            'architecture_': { validator: (v) => validators.string(v, 1000) },
            'mindmap_': { validator: (v) => validators.string(v, 1000) },
            'kanban_': { validator: (v) => validators.string(v, 1000) },
            'git-graph_': { validator: (v) => validators.string(v, 1000) },
            'c4_': { validator: (v) => validators.string(v, 1000) },
            'sankey_': { validator: (v) => validators.string(v, 1000) },
            'packet_': { validator: (v) => validators.string(v, 1000) },
            'block_': { validator: (v) => validators.string(v, 1000) },
            'radar_': { validator: (v) => validators.string(v, 1000) },
            'dompurify-config_': { validator: (v) => validators.string(v, 1000) },
        }
    },    

    plantuml: {
        options: {
            'theme': { validator: validators.enum([
                'amiga', 
                'black-knight', 
                'bluegray', 
                'blueprint', 
                'cerulean-outline',
                'crt-amber',
                'crt-green',
                'cyborg-outline',
                'cyborg',
                'hacker',
                'hacker-hold',
                'lightgray',
                'materia-outline',
                'materia',
                'metal',
                'mimeograph',
                'minty',
                'plain',
                'resume-light',
                'sandstone',
                'silver',
                'sketchy-outline',
                'sketchy',
                'spacelab',
                'superhero-outline',
                'superhero',
                'united'
            ]) },
            'no-metadata': { validator: validators.boolean }
        }
    },

    structurizr: {
        options: {
            'view-key': { validator: (v) => validators.string(v, 256) },
            'theme': { validator: validators.enum([
                'diagram',
                'legend'
            ])}
        }
    },

    svgbob: {
        options: {
            'background': { validator: (v) => validators.string(v, 100) },
            'font-family': { validator: (v) => validators.string(v, 100) },
            'font-size': { validator: (v) => validators.number(v, 1, 120, true) },
            'fill-color': { validator: (v) => validators.string(v, 100) },
            'scale': { validator: (v) => validators.number(v, 0, 100) },
            'stroke-width': { validator: (v) => validators.number(v, 0, 100) }
        }
    },
    
    symbolator: {
        options: {
            'component': { validator: (v) => validators.string(v, 999) },
            'transparent': { validator: validators.boolean },
            'title': { validator: (v) => validators.string(v, 256) },
            'scale': { validator: (v) => validators.number(v, 0, 100) },
            'no-type': { validator: validators.boolean },
            'library-name': { validator: (v) => validators.string(v, 256) },
        }
    }
};

// Helper function to get diagram config (handles aliases)
export function getDiagramConfig(diagramType) {
    if (!diagramType) return null;

    const type = diagramType.toLowerCase();

    // Handle common aliases
    const aliases = {
        'c4plantuml': 'plantuml'
    };

    return diagramConfigs[aliases[type] || type] || null;
}
