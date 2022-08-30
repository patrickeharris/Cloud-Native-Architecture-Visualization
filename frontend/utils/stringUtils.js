/**
 * This function turns a path ex: "/visualizer/3d" into a nice string like "Visualizer 3d"
 * @param {String} asPath The asPath attribute from the router
 * @returns {String} A pretty string
 */
export const getHeaderString = (asPath) => {
    if (asPath === "/") {
        asPath = "Home";
    }

    const words = asPath.split("/");
    const capitalize = words.map((word) => {
        if (!word.charAt(0).match(/[a-z]/i)) {
            return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalize.join(" ");
};
