\name{pp_dataPlot}
\alias{pp_dataPlot}
\docType{data}
\title{Palyoplot sample list of taxa counts including age model (data type: list)}
\description{Sample data with age model merged into count data (by interpolated depth)}
\usage{data("pp_dataPlot")}
\format{
  A data frame with 6 observations on the following 47 variables.
  \describe{
    \item{\code{age}}{a numeric vector}
    \item{\code{adj_depth}}{a numeric vector}
    \item{\code{core_depth}}{a numeric vector}
    \item{\code{Abies}}{a numeric vector}
    \item{\code{Alnus}}{a numeric vector}
    \item{\code{Amaranthaceae}}{a numeric vector}
    \item{\code{Ambrosia}}{a numeric vector}
    \item{\code{Apiaceae}}{a numeric vector}
    \item{\code{Arceuthobium}}{a numeric vector}
    \item{\code{Artemisia}}{a numeric vector}
    \item{\code{Asteracea}}{a numeric vector}
    \item{\code{Betula}}{a numeric vector}
    \item{\code{Brassicaceae}}{a numeric vector}
    \item{\code{Caryophyllaceae}}{a numeric vector}
    \item{\code{Ceanothus}}{a numeric vector}
    \item{\code{Chrysolepis}}{a numeric vector}
    \item{\code{Corylus}}{a numeric vector}
    \item{\code{Cupressaceae}}{a numeric vector}
    \item{\code{Cyperaceae}}{a numeric vector}
    \item{\code{Ephedra.nevadenses}}{a numeric vector}
    \item{\code{Fabaceae}}{a numeric vector}
    \item{\code{Fraxinus}}{a numeric vector}
    \item{\code{Indeterminate}}{a numeric vector}
    \item{\code{Isoetes}}{a numeric vector}
    \item{\code{Lamiaceae}}{a numeric vector}
    \item{\code{Liliaceae}}{a numeric vector}
    \item{\code{Lycopodium}}{a numeric vector}
    \item{\code{Monolete}}{a numeric vector}
    \item{\code{Pediastrum}}{a numeric vector}
    \item{\code{Pinus}}{a numeric vector}
    \item{\code{Plantago}}{a numeric vector}
    \item{\code{Poaceae}}{a numeric vector}
    \item{\code{Polemoniaceae}}{a numeric vector}
    \item{\code{Polygonaceae}}{a numeric vector}
    \item{\code{Pteridium}}{a numeric vector}
    \item{\code{Quercus}}{a numeric vector}
    \item{\code{Rosaceae}}{a numeric vector}
    \item{\code{Salix}}{a numeric vector}
    \item{\code{Sarcobatus}}{a numeric vector}
    \item{\code{Shepherdia}}{a numeric vector}
    \item{\code{Sporomiella}}{a numeric vector}
    \item{\code{Stomates}}{a numeric vector}
    \item{\code{Trilete}}{a numeric vector}
    \item{\code{Tsuga}}{a numeric vector}
    \item{\code{Typha.angustifolia}}{a numeric vector}
    \item{\code{Typha.latifolia}}{a numeric vector}
    \item{\code{Unknown}}{a numeric vector}
  }
}
\examples{
data(pp_dataPlot)

#convert count data to percentages. Keep only taxa with min 2%
xData = palyoplot_convertPercentages(data=pp_dataPlot[,4:length(pp_dataPlot)],
                                     per.min=2, per.recalc=FALSE)

#plot
g = palyoplot_plotTaxa(x=xData, y=pp_dataPlot[,1:2],
                       y.label="cal yr BP", ylim=c(66, -61), y.break=25)}
\keyword{datasets}
