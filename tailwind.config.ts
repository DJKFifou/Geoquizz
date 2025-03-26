import defaultTheme from 'tailwindcss/defaultTheme';
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
            },
			screens: {
			  '4xs': '320px',
			  '3xs': '380px',
			  '2xs': '430px',
			  xs: '530px',
			},
			fontSize: {
			  '2xs': ['0.625rem', '0.875rem'],
			  '3.5xl': ['2rem', '2.5rem'],
			  '4.5xl': ['2.5rem', '2.813rem'],
			  '5.5xl': ['3.375rem', '3.375rem'],
			  '6.5xl': ['4rem', '3.4rem'],
			  '8.5xl': ['7rem', '7.313rem'],
			},
			maxWidth: {
			  screen: '100vw',
			},
		}
	},

	plugins: []
} satisfies Config;
