<div>
  <p align="center">
    <img src="https://github.com/visprex/visprex/assets/20113339/03fae63d-6518-45b5-affd-da00e0c746b2" />
  </p>
  <p align="center">Visualise your CSV files <b>in seconds</b> without sending your data anywhere</p>
  <p align="center"> <a href="https://visprex.com">Visprex App</a> | <a href="https://docs.visprex.com">Documentation</a></p>
</div>

## Getting Started

### Loading your dataset
Your data is procecced entirely in your browser without sending your data to any servers. Only network calls this application has are those downloading example datasets from public buckets.

Once you upload your CSV file, it will automatically parse your data into either `Categorical` or `Numerical` types

![schema](https://github.com/user-attachments/assets/d526dfb9-adc6-4028-8b1d-71d96780a7ba)

> Reference: [Loading your dataset](https://docs.visprex.com/features/datasets/)


### Visualise your data
#### Histogram
Histograms are useful for understanding the feature distributions, especially to see if they follow certain distributions (e.g. Gaussian, uniform, Poisson etc).

![hist](https://github.com/user-attachments/assets/981439d2-29e5-4250-a069-8e95ec66fc90)

There are built-in log transformation methods available.

![log_hist](https://github.com/user-attachments/assets/5876a33d-7ae8-49a0-8621-a598b0b75424)

> Reference: [Understand feature distributions](https://docs.visprex.com/features/histogram/)


#### Scatterplot
You can choose two variables to visualise on a 2D scatterplot. The variable you choose first will show up on the X-axis and the second variable will be on the Y-axis.

Hovering over individual points will show you the details of that instance.

![scatter](https://github.com/user-attachments/assets/7b3c2d79-7ad6-416c-98ef-d4d9d647f5f9)

You can optionally add **filters** to control for certain variable values or look at specific sub-sections. See reference for a list of supported operators.

![filters](https://github.com/user-attachments/assets/509b56d2-4a05-45e3-907c-e6bee4d6859e)

> Reference: [Visualise linear relationships](https://docs.visprex.com/features/scatterplot/)


#### Correlation Matrix
You can find linear correlations for any pair of variables from the correlation map, where purpole indicates positive correlation and red indicates negative correlation.

![corr](https://github.com/user-attachments/assets/1b5a2eb6-5129-478c-947f-8685d41363de)

> Reference: [Check correlatins between features](https://docs.visprex.com/features/correlation/)

## Development

```bash
npm ci
npm run dev
open http://localhost:5173/
```
