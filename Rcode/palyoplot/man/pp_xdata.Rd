\name{pp_xdata}
\alias{pp_xdata}
\docType{data}
\title{Palyoplot sample list of taxa counts (in percentages) only (data type: list)}
\description{Sample list of taxa percentages to plot. To be used in conjunction with pp_ydata}
\usage{data("pp_xdata")}
\format{
  A data frame with 6 observations on the following 9 variables.
  \describe{
    \item{\code{Abies}}{a numeric vector}
    \item{\code{Asteracea}}{a numeric vector}
    \item{\code{Cupressaceae}}{a numeric vector}
    \item{\code{Fraxinus}}{a numeric vector}
    \item{\code{Indeterminate}}{a numeric vector}
    \item{\code{Pinus}}{a numeric vector}
    \item{\code{Poaceae}}{a numeric vector}
    \item{\code{Polygonaceae}}{a numeric vector}
    \item{\code{Quercus}}{a numeric vector}
    \item{\code{Rosaceae}}{a numeric vector}
    \item{\code{Salix}}{a numeric vector}
    \item{\code{Unknown}}{a numeric vector}
  }
}
\examples{
data(pp_xdata)

#plot taxa
g = palyoplot_plotTaxa(x=pp_xdata, y=pp_ydata,
                       y.label="cal yr BP", ylim=c(70, -61), y.break=20)
}
\keyword{datasets}
