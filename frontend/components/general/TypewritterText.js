import React from "react";
import styles from "../../styles/Typewritter.module.css";

const TypewritterText = ({ text, ...props }) => {
    return (
        <div className={styles.typewritter}>
            <div className={styles.text}>{text}</div>
        </div>
    );
};

export default TypewritterText;
