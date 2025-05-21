import * as React from 'react';
import classes from '../Header.module.css'


export const Logo: React.FC = () => {
    return(
        <div className={classes.logo}>
            <img src="https://cdn-icons-png.flaticon.com/512/8981/8981608.png"  alt="Gadget Store" className={classes['logo-image']} />
            <h1 className={classes['logo-text']}>Techzy</h1>
        </div>
    );
};