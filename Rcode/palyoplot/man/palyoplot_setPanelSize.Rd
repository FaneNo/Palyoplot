\name{palyoplot_setPanelSize}
\alias{palyoplot_setPanelSize}
\title{Sets plotting panel size}
\description{Simplified standard to set plotting panel size}
\usage{palyoplot_setPanelSize(
p=NULL,
g=ggplotGrob(p),
file=NULL,
margin= unit(1, "mm"),
width = unit(5, "cm"),
height= unit(10, "cm")
)}
\arguments{
  \item{p}{plot object. Default NULL (to just set a panel)}
  \item{g}{ggplot grob. Default ggplotGrob(p)}
  \item{file}{name of file to ggsave. Default NULL}
  \item{margin}{Panel margins. Default 1 mm}
  \item{width}{Panel width. Default 5 cm}
  \item{height}{Panel height. Default 10 cm}
}
\value{returns grob}
\author{Anna Klimaszewski-Patterson}
\examples{
  top.label.height = 2.25  # in cm
  plot.height = 10         # in cm
  display.height = unit(3, "cm")
  display.width = unit(11, "cm")

  g = gtable(unit(.02, "cm"), unit(c(top.label.height,plot.height), "cm"))
  g = palyoplot_setPanelSize(g=g, width=display.width, height=display.height)
}
