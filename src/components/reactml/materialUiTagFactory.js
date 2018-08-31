import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default { Paper, Grid, Button, TextField };

// export default (tag, props, children) => {
//     try {
//         // console.log('rendering ', tag, props, children);
//         return React.createElement(tags[tag] || tag, props, children);
//     } catch (err) {
//         // console.error(err);
//         return React.createElement('div', {}, ['error']);
//     }
// };