const svgs = import.meta.glob("./svgs/*.svg");
import easy from './easy.json';

export async function getEasy() {
    const svgPromises = Object.keys(svgs).reduce((acc, key) => {
        acc[key] = svgs[key]();
        return acc;
    }, {} as Record<string, Promise<any>>);

    const svgModules = await Promise.all(Object.values(svgPromises));

    const loadedSvgs = Object.keys(svgPromises).reduce((acc, key, index) => {
        acc[key] = svgModules[index].default;
        return acc;
    }, {} as Record<string, string>);

    return easy.map((question: any) => {
        const svgPath = `./svgs/${question.answer.toLowerCase()}.svg`;
        return { ...question, image: loadedSvgs[svgPath] };
    });
}
