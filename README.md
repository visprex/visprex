![image](https://github.com/KengoA/visprex/assets/20113339/03fae63d-6518-45b5-affd-da00e0c746b2)

Visualise your CSV files **in seconds** without sending your data anywhere

## Getting Started
- [Visprex App](https://www.visprex.com)
- [Visprex Documentation](https://docs.visprex.com)

### Loading your data
Your data is procecced entirely in your browser without sending your data to any servers. Only network calls this application has are those downloading example datasets from public buckets.

Once you upload your CSV file, it will automatically parse your data into either `Categorical` or `Numerical` types

> Reference: [Loading your dataset](https://docs.visprex.com/features/datasets/)

![schema](https://github.com/KengoA/visprex/assets/20113339/2c3de5cd-b197-49c8-ad5f-0e5cca52f79f)


### Visualise your data
#### Histogram
Histograms are useful for understanding the feature distributions.

![hist](https://github.com/KengoA/visprex/assets/20113339/7fb3fd86-921d-4f99-a92e-92621bee8ce2)

There are built-in log transformation methods available.

![hist_log10](https://github.com/KengoA/visprex/assets/20113339/fb6ebf6f-9600-4ac0-b226-3faf832ec618)

> Reference: [Understand feature distributions](https://docs.visprex.com/features/histogram/)


#### Scatterplot
You can choose two variables to visualise on a 2D scatterplot. The variable you choose first will show up on the X-axis and the second variable will be on the Y-axis.

Hovering over individual points will show you the details of that instance.

![scatter](https://github.com/KengoA/visprex/assets/20113339/2c3dfa55-72c5-4039-b84d-539c01a816dd)

You can optionally add filters to control for certain variable values.

> Reference: [Visualise linear relationships](https://docs.visprex.com/features/scatterplot/)


#### Correlation Matrix
You can find linear correlations for any pair of variables from the correlation map, where purpole indicates positive correlation and red indicates negative correlation.

![corr](https://github.com/KengoA/visprex/assets/20113339/8b0b77c9-0efb-48e8-b44b-4f1327cf1250)

> Reference: [Check correlatins between features](https://docs.visprex.com/features/correlation/)

## Development

```bash
npm ci
npm run dev
open http://localhost:5173/
```
