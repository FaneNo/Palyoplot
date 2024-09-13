\name{palyoplot_assignAges}
\alias{palyoplot_assignAges}
\title{interpolate ages from age model and assign to depths}
\description{interpolate ages from age model and assigns to depths (useful if depths have decimal places and age model is in whole increments)}
\usage{palyoplot_assignAges(
df,
agemodel,
df.col.depth = 1,
agemodel.col.depth = 1,
agemodel.col.age = 5
)}
\arguments{
  \item{df}{data object (ex: pollen counts)}
  \item{agemodel}{age model object}
  \item{df.col.depth}{column number of core depths in df object. Default 1}
  \item{agemodel.col.depth}{column number of depths in age object. Default 1}
  \item{agemodel.col.age}{column number of ages in age object. Default 5}
}
\value{
  \item{age}{interpolated (rounded) age based on depth}
  \item{df}{df that was passed in}
}
\author{Anna Klimaszewski-Patterson}
\examples{
  ### generic data
  #generate age model
  agemodel = data.frame(depth=seq(from=0, to=50, by=1), age=seq(from=-60, to=100, by=3.2))
  #generate taxa and counts
  df = data.frame(depth=c(0, 12.2, 22.5, 50),
                  Abies=c(50,12,24,32),
                  Pinus=c(54,20,44,19),
                  Quercus=c(12,50,20,11),
                  Roseaceae=c(4,9,12,2))

  #run function
  data = palyoplot_assignAges(df, agemodel=agemodel, df.col.depth=1,
                              agemodel.col.depth=1, agemodel.col.age=2)

  ### alternative using package data
  data = palyoplot_assignAges(pp_data, agemodel=pp_agemodel,  df.col.depth=2,
                              agemodel.col.depth=1, agemodel.col.age=5)
}
