const defaultTheme = require("tailwindcss/defaultTheme");
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				"white" : "#F2F5F8",
				"grey" : "#405869",
				"turquoise" : "#13D8CC"
			},
			borderRadius: {
				"4xl" : "1.875rem",
				"5xl" : "2.25rem"
			},
			fontFamily: {
                sans: ["Sequel", ...defaultTheme.fontFamily.sans],
            }
		}
	},

	plugins: []
} satisfies Config;
