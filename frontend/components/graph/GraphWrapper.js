import dynamic from "next/dynamic";

/**
 * This has to be a dynamic import to work due to ES6 module stuff being weird.
 * https://github.com/vasturiano/react-force-graph/issues/352
 * https://nextjs.org/docs/advanced-features/dynamic-import
 */
const Graph = dynamic(() => import("./Graph"), {
    ssr: false,
});

export default Graph;
