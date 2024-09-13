\name{palyoplot_plotIndex}
\alias{palyoplot_plotIndex}
\title{Plot taxa using an index graph (-1 to 1)}
\description{Plot an index graph. Supports stylized index line, zero line, and coloring negative vs positive side of graph. Supports multiple y-axes or not showing y-axis}
\usage{palyoplot_plotIndex(
x,
y,
y.label,
ylim = NULL,
y.show = TRUE,
y.break = NULL,
y2 = NULL,
y2.label = NULL,
xlim=NULL,
x.break = .2,
x.reverse = FALSE,
x.label = NULL,
x.label.height = .5,
x.label.text.gpar = gpar(fontsize = 10),
x.label.pos = 'bottom',
x.tickwidth = 1,
zones = NULL,
zones.anno.width = 1,
display.height = NULL,
display.width = NULL,
color = 'black',
plot.style = 'line',
plot.style.color = 'black',
plot.style.bar.size = 5,
plot.line.lwd = 1,
plot.line.linetype = 'solid',
plot.font.style = 'plain',
plot.height = 10,
plot.spacer = .25,
plot.vspacer = .25,
top.label.height = 2.25,
title = NULL,
title.gpar = gpar(fontsize = 12),
title.just = c("center", "bottom"),
axis.text.size = 8,
axis.title.size = 12,
axis.title.x.font.style = 'plain',
axis.title.x.angle = 0,
axis.title.x.just = c("center", "top"),
axis.title.x.hjust = 0.01,
axis.title.x.vjust = 0.5,
axis.title.x.margin = -35,
axis.title.y = 8,
axis.title.y.angle = 90,
axis.title.y.hjust = 0.1,
axis.title.y.vjust = 0,
zeroline=TRUE,
zeroline.color="black",
zeroline.linetype="dashed",
bg.neg.fill = NULL,
bg.neg.alpha = .5,
bg.pos.fill = NULL,
bg.pos.alpha = .5,
returnSepPlots = FALSE
)}
\arguments{
  \item{x}{REQ: the data <taxa> (in columns) to plot}
  \item{y}{REQ: first column in ydata is the main y-axis}
  \item{y.label}{REQ: label for primary y-axis}
  \item{ylim}{limits on y-axis (ex: c(2000, 0)). Default NULL}
  \item{y.show}{Show y-axis (TRUE/FALSE). Default TRUE}
  \item{y.break}{y-tick break every how many years (ex: 100). Default NULL}
  \item{y2}{secondary axis information. Built by palyoplot_get2ndAxis(). Default NULL}
  \item{y2.label}{label for the secondary y-axis.Default NULL}
  \item{xlim}{limits on x-axis (ex: x(-1, 1)). Default NULL}
  \item{x.break}{x-tick break every how many units. Default 0.2}
  \item{x.reverse}{Reverse x-axis. Default FALSE}
  \item{x.label}{label to place under all plots for x-axis (ex: percentages). Default NULL}
  \item{x.label.height}{value in cm for the height of x.label. Default .5}
  \item{x.label.text.gpar}{label s-axis formatting. Default gpar(fontsize = 10)}
  \item{x.label.pos}{label x-axis position. Default 'bottom'}
  \item{x.tickwidth}{how wide is each x-axis tick block (in cm). Default = 1}
  \item{zones}{lines for taxa zonation, if known. Built as a data.frame that includes solumns "axisVal" (req. Axis intercept), "ltype" (line type. Default "solid"), "lcolor" (line color. Default grey50), "annoText" (zone label), "annoColor" (text color. Default grey50), "annoAxis" (alignment of text on axis), "axisOffset" (offset from other axis for display positioning)). Default NULL}
  \item{zones.anno.width}{width of column for zone annotation (in cm). Default .75}
  \item{display.height}{height of plot. Default NULL. Ex: unit(5, "in")}
  \item{display.width}{width of plot. Default NULL}

  \item{color}{Color to apply to index line. Default 'black'}
  \item{plot.style}{Style of plot (line or bar). Default line}
  \item{plot.style.color}{Color of data (line, bar, or area). Default 'black'}
  \item{plot.style.bar.size}{Size of plotted bars (requires plot.style='bars'. Default 5}
  \item{plot.line.lwd}{line width of index line. Default 1}
  \item{plot.line.linetype}{line type for index line (standard ggplot options). Default 'solid'}
  \item{plot.font.style}{default font style to apply to xdata labels. Default 'plain'}
  \item{plot.height}{height of the plot itself. In cm}
  \item{plot.spacer}{space between plots (in cm)}
  \item{plot.vspacer}{vertical space between plots (in cm)}
  \item{top.label.height}{height of xdata labels, in cm. Use if groups labels are overlapping taxa labels. Default=2.25}
  \item{title}{title of plot. Default NULL}
  \item{title.gpar}{gpar of title. Default gpar(fontsize = 12)}
  \item{title.just}{title justification. Default c("center", "bottom")}
  \item{axis.text.size}{font size of axis text. Default 8}
  \item{axis.title.size}{font size of axis title. Default 12}
  \item{axis.title.x.font.style}{font style of axis title. Default 'plain'}
  \item{axis.title.x.angle}{angle of text for axis title. Default 0}
  \item{axis.title.x.just}{justification of axis title. Default c("center", "top")}
  \item{axis.title.x.hjust}{adjustment for x-axis title location. Default 0.01}
  \item{axis.title.x.vjust}{vertical adjustment of x-axis title location. Default 0.5}
  \item{axis.title.x.margin}{use in combination with axis.title.x.vjust if text is going below the header line}
  \item{axis.title.y}{font size of y-axis text}
  \item{axis.title.y.angle}{angle of text for the y-axis. Default 90}
  \item{axis.title.y.hjust}{adjustment for x-axis title location. Default c("center", "top")}
  \item{axis.title.y.vjust}{vertical adjustment for x-axis title location}
  \item{zeroline}{Whether line at zero should display. Default TRUE}
  \item{zeroline.color}{color of zero line. Default "black"}
  \item{zeroline.linetype}{line type for zero line (standard ggplot options). Default 'dashed'}
  \item{bg.neg.fill}{Color to fill negative side of index (ex: #ff0000). Default NULL}
  \item{bg.neg.alpha}{alpha value of negative fill. Default .5}
  \item{bg.pos.fill}{Color to fill positive side of index (ex: #00ff00). Default NULL}
  \item{bg.pos.alpha}{alpha values of positive fill. Default .5}
  \item{returnSepPlots}{whether to return plot in list. Default FALSE (returns grid object)}
}
\value{returns ggplot object}
\author{Anna Klimaszewski-Patterson}
\seealso{
  \code{\link{palyoplot_get2ndAxis}}
}
\examples{
### EXAMPLE 1: Basic w/ generic data
maxAge = 100; #max age to plot
minAge = -60; #min age to plot
ages = data.frame(depth=c(0,20,40,60), age=c(-60,-10,40,100))
xdata = c(.2, .4, -.1, -.4)

#plot and return ggplot2 object
g = palyoplot_plotIndex(x=xdata, y=ages[,2],
                        y.label="cal yr BP", ylim=c(maxAge, minAge),
                        axis.title.x.hjust = 0.55, title=paste(colnames(xdata), collapse='/'),
                        x.label="Thing 1    Thing 2")

### EXAMPLE2: Basic w/ using package data
xdata = (pp_data$Abies - pp_data$Quercus) / (pp_data$Abies + pp_data$Quercus)

botAge = 115; #max age to plot
topAge = -20; #min age to plot
#plot and return ggplot2 object

g = palyoplot_plotIndex(x=xdata, y=pp_ydata,
                        y.label="cal yr BP", ylim=c(topAge, botAge),
                        title="Oak/Fir\nIndex", x.label="Oak       Fir")

### EXAMPLE 3: Advanced w/ using package data
y2 = palyoplot_get2ndAxis(interval=2, top=min(pp_ydata), bot=max(pp_ydata),
                          ages=pp_agemodel, ages.col.secondary=1, ages.col.age=5,
                          agemodel=TRUE)

g = palyoplot_plotIndex(x=xdata, y=pp_ydata, y.label="cal yr BP",
                        ylim=c(max(pp_ydata), min(pp_ydata)),
                        title="Fir/Oak\nIndex", x.label="Fir       Oak",
                        axis.title.x.hjust = 0.25,
                        x.break=.1, xlim=c(-.15, .25),
                        y.break=20,
                        y2=y2, y2.label="  depth (cm)",
                        #y.show=FALSE,
                        plot.style.color="darkgreen", plot.line.lwd=2,
                        bg.neg.fill="bisque", bg.neg.alpha=.25,
                        bg.pos.fill="cadetblue1", bg.pos.alpha=.25,
                        x.reverse=TRUE, zeroline=FALSE)
}
