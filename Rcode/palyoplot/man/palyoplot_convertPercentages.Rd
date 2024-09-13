\name{palyoplot_convertPercentages}
\alias{palyoplot_convertPercentages}
\title{Convert taxa count values to percentages}
\description{Dynamically converts count data to percentage values}
\usage{palyoplot_convertPercentages(
data,
per.min = 1,
per.recalc = FALSE,
data.exclude = NULL,
data.drop = NULL
)}
\arguments{
  \item{data}{data.frame of count data with taxa names as column names}
  \item{per.min}{minium percentage threshold to keep the taxa (default 1 aka 1\%)}
  \item{per.recalc}{whether to recalculate the row's percentages after columns below thw minimum percentage threshold are dropped. Default FALSE}
  \item{data.exclude}{list of taxa which should be excluded from total sum calculations (when calculating \%) Default NULL}
  \item{data.drop}{list of taxa to be completely dropped from the data variable. Default NULL}
}
\value{ returns object with data converted to percentages}
\author{Anna Klimaszewski-Patterson}
\seealso{
  \code{\link{palyoplot_getTaxaNamesByGroup}}
}
\examples{
    #fields to exclude from calculating percentages. Based on taxa groups
    exclude = palyoplot_getTaxaNamesByGroup(data=pp_xdata,
                                            taxaList=pp_taxaList,
                                            group=c('a', 'c', 'o', 'z'),
                                            group.field.id='life_id',
                                            taxaList.field.id="taxa_name")

    per_xData = palyoplot_convertPercentages(data=pp_xdata, per.min=1,
                                             data.exclude=exclude,
                                             data.drop=exclude)
}
