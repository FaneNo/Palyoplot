\name{pp_ydata}
\alias{pp_ydata}
\docType{data}
\title{Palyoplot sample list of taxa counts (in percentages) only (data type: list)}
\description{Sample list of y-axis data (age, depth). To be used in conjunction with pp_xdata}
\usage{data("pp_ydata")}
\format{
  A data frame with 6 observations on the following 2 variables.
  \describe{
    \item{\code{age}}{a numeric vector}
    \item{\code{core_depth}}{a numeric vector}
  }
}
\examples{
data(pp_ydata)

#plot taxa
g = palyoplot_plotTaxa(x=pp_xdata, y=pp_ydata,
                       y.label="cal yr BP", ylim=c(70, -61), y.break=20)
}
\keyword{datasets}
