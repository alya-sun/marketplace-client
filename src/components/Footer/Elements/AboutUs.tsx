import * as React from 'react';
import classes from '../Footer.module.css'

export const AboutUs: React.FC = () => {
    return(
        <div className={classes.about}>
                <h4>About us</h4>
                <p>We're here to make your digital life easier.
                </p>
        </div>
    );
};