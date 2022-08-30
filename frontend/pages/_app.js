import React from "react";
import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import Layout from "../components/Layout";

import { useRouter } from "next/router";
import { getHeaderString } from "../utils/stringUtils";

// The following imports prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import "@fortawesome/fontawesome-svg-core/styles.css";

// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

/**
 * This is the root of a next.js app. Editing this file will edit the main item
 * returned to the react render function.
 *
 * https://nextjs.org/docs/getting-started
 *
 * @param {Object} props The props passed to this component
 * @param {React.Component} props.Component The page to be rendered, automatically determined by the next router (https://nextjs.org/docs/basic-features/pages)
 * @param {any} props.pageProps Any other props passed to this page
 * @returns
 */
function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const path = router.asPath;

    return (
        <>
            <Head>
                <title>{getHeaderString(router.asPath)}</title>
                <meta
                    name="description"
                    content="A web app to identify, detect, and educate about antipatterns."
                />
            </Head>

            {/* This Handles importing any and all fontawesome icons.*/}
            <Script
                src="https://kit.fontawesome.com/1b232c1fd4.js"
                crossorigin="anonymous"
            ></Script>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default MyApp;
