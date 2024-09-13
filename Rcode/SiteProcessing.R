# install.packages("RMySQL")
# install.packages("reshape2")
# install.packages("rioja")
# install.packages("ggplot2")
# install.packages("gtable")
# install.packages("grid")
# devtools::install_github("wfinsinger/tapas") #CharAnalysis for R
require(ggplot2);
library(grid);
library(gridExtra);
library(plyr);
library(gtable);
library(rioja);
library(palyoplot);

PREPROCESS  = FALSE
WRITETOFILE = FALSE
RUNBACON = FALSE
### Clam provides more reasonable and understandable age model
RUNCLAM = FALSE
ASSIGNAGEMODEL = FALSE

### SET VARIABLES FOR SITE TO BE ANALYZED ###
siteName = "Markwood Meadow"
dbName   = "MWM"

maxAge = 1300;
minAge = -69;
splineBy = 50
###

# require(RMySQL);
# db = dbConnect(MySQL(), user='root', password='', dbname=dbName, host='127.0.0.1');

setwd("~/Dropbox/Research/Projects/Paleoecology/SierraNevada/NA_2017-2020/")
#setwd("C://Users/anna.kp/Dropbox/Research/Projects/Paleoecology/SierraNevada/NA_2017-2020/")
# #setwd("C:/Users/annap/Dropbox/_UNR/Dissertation/")
# source ("Analysis/pollen_calculate_functions.R")
# source ("Analysis/pollen_do_functions.R")
# source ("Analysis/pollen_plot_functions.R")
# source ("Analysis/strat.plot.R") #customized from rioja library
# source ("Analysis/palyoplot.R")

#==================== VARIABLES ============================#
fData       = paste("Data/",dbName,"/", sep="")
dAgeModel   = paste(fData, "AgeModel/", sep="")
dClamDir    = paste(dAgeModel,"clam_runs/", sep="")
dAgeSubDir  = "all/"
dBaconDir   = paste(dAgeModel,"bacon_runs/", sep="")
#dAgeSubDir  = ""
#fBaconAgeModel   = paste(dBaconDir, dAgeSubDir, "MWM_26_ages.txt", sep="")
fClamAgeModel   = paste(dClamDir, dbName,"/", dAgeSubDir, "MWM_smooth_spline_ages.txt", sep="")

#fAgeModel = fBaconAgeModel
fAgeModel = fClamAgeModel

if(RUNBACON){
  library(rbacon);
  Bacon(core=dbName, coredir=dAgeModel,
        rev.d=FALSE, rev.age=FALSE, rotate.axes=TRUE)
}

if(RUNCLAM){
  library(clam)
  bacon2clam(core=dbName, bacondir = dAgeModel, clamdir = dClamDir, sep = ",")

  clam(core=dbName, coredir=dClamDir,
       revd=TRUE, revyr=FALSE, type=4, youngest=-69)
}
#Ages = read.csv(paste(fData, "AgeModel/MWM19_36_ages.txt", sep=""), sep="\t")
Ages = read.csv(fAgeModel, sep="\t")
colAgeDepth = 1
colAgeAge = 4#5 Bacon, 4 Clam

fAnalysis   = paste("Analysis/",dbName,"/", sep="")
fPDSI       = "SecondaryData/PDSI/"
fPreProcess = paste(fAnalysis,"PreProcessed_R_output/", sep="")
fOutput     = paste(fAnalysis,"R_output/", sep="")
fPollenFile = paste(fData, "Pollen/",dbName,"CombinedCounts.csv", sep="")
fCharcoalFile = paste(fData, "Charcoal/",dbName,"_charcoal_counts.csv", sep="")


#===========================================================#
# Pollen counts (by Theo, as of 10/08/2021)
Pollen   = read.csv(fPollenFile) #read in CSV derived from Raw tab in .xlsx
#Pollen = Pollen[1:38,]
Pollen$Quercus = Pollen$Quercus..Smooth. + Pollen$Quercus..Rough. #combine rough and smooth oak counts
Pollen$VRI = (Pollen$Abies - Pollen$Quercus)/(Pollen$Abies + Pollen$Quercus)
# Charcoal counts
Charcoal = read.csv(fCharcoalFile) #read in CSV derived from Raw tab in .xlsx
Charcoal = na.omit(Charcoal) #remove NA rows
colnames(Charcoal)[colnames(Charcoal) == 'acc_rate'] = 'char_accum'

# PDSI1 -- from site location (10/08/2021)
PDSI    = read.csv("SecondaryData/PDSI/NADA_Reconstructed_JJA_PDSI_0_2005_MWM.txt", sep="\t")#, skip=2);
PDSI$CalYrBP = 1950 - PDSI$Year
# PDSI2 -- from cell 47
PDSI2    = read.csv("SecondaryData/PDSI/PDSI_047.csv");
PDSI2$PDSI = PDSI2$RECON

if( ASSIGNAGEMODEL){
  ##POLLEN
  #read in pollen sheet and assign calculated ages to decompressed depths
  df = palyoplot_assignAges(Pollen, Ages, df.col.depth=1, agemodel.col.depth=colAgeDepth, agemodel.col.age=colAgeAge)
  #assign corrected ages
  Pollen$Age = df$age
  if(WRITETOFILE){
    write.csv(Pollen, #write updated data to file
              file=fPollenFile, row.names=FALSE, quote=FALSE)
  }

  ##CHARCOAL
  df = palyoplot_assignAges(Charcoal, Ages, df.col.depth=4, agemodel.col.depth=colAgeDepth, agemodel.col.age=colAgeAge)
  #assign corrected ages
  Charcoal$age_Top = df$age
  Charcoal$years_depth = df$years_depth
  Charcoal = palyoplot_calcAccumRate(Charcoal, df.col.depth=4, df.col.age=5,
                                     df.col.val=6, df.col.yrsDepth=7)
  if(WRITETOFILE){
    write.csv(Charcoal, #write updated data to file
              file=fCharcoalFile, row.names=FALSE, quote=FALSE)
  }
}

###
##### START: Interpolate to 50-year #####
###
# Pollen
#  x.new = seq(minAge,maxAge,by=50)
x.new = seq(maxAge,minAge,by=-splineBy)
sp.interp = interp.dataset(y=Pollen, x=Pollen$Age, xout=x.new, method="sspline", rep.negt=FALSE)
rownames(sp.interp) <- x.new
pPollen = sp.interp
pPollen[,'Age'] = as.numeric(rownames(pPollen))

# Charcoal
x.new = seq(maxAge,minAge,by=-splineBy)
sp.interp = interp.dataset(y=Charcoal[,c(4,5,8,7)], x=Charcoal$age_Top, xout=x.new, method="sspline", rep.negt=FALSE)
rownames(sp.interp) <- x.new
pCharcoal = sp.interp
pCharcoal[,'age_Top'] = as.numeric(rownames(pCharcoal))

# PDSI1 -- from site location (10/08/2021)
x.new = seq(maxAge,minAge,by=-splineBy)
sp.interp = interp.dataset(y=PDSI, x=PDSI[,'CalYrBP'], xout=x.new, method="sspline", rep.negt=FALSE)
rownames(sp.interp) <- x.new
pPDSI = sp.interp
pPDSI[,'CalYrBP'] = as.integer(rownames(pPDSI))

# PDSI2 -- from cell 47
x.new = seq(maxAge,minAge,by=-splineBy)
sp.interp2 = interp.dataset(y=PDSI2, x=PDSI2[,'CalYrBP'], xout=x.new, method="sspline", rep.negt=FALSE)
rownames(sp.interp2) <- x.new
pPDSI2 = sp.interp2
pPDSI2[,'CalYrBP'] = as.integer(rownames(pPDSI2))


# x.new = seq(minAge,maxAge,by=50)
# spp = dataCharcoal[,1:4]
# sp.interp = interp.dataset(y=spp, x=dataCharcoal$age_Top, xout=x.new, method="sspline", rep.negt=FALSE) #already splined in CharAnalysis
# rownames(sp.interp) <- x.new
# pCharcoal = sp.interp


write.csv(pPollen, paste(fOutput, "data_pPollenBacon.csv", sep=""))
write.csv(pPDSI, paste(fOutput, "data_pPDSI.csv", sep=""))
write.csv(pCharcoal, paste(fOutput, "data_pCharAccumClam.csv", sep=""))
##### END: Interpolate to 50-year #####

###
##### START: Plot charts #####
###
## Pollen
xdata = pPollen[,'VRI'] #interpolated
ydata = data.frame(age=as.numeric(rownames(pPollen)), depth=pPollen[,'Depth'])
#xdata = Pollen['VRI'] #raw
#ydata = data.frame(age=as.numeric(Pollen$Age), depth=Pollen$Depth)
pP = palyoplot_plotIndex(x=xdata, y=ydata, y.label="cal yr BP",
                        title="VRI",
                        plot.style.color="springgreen4",
                        ylim=c(maxAge, minAge), y.break=100,
                        xlim=c(-.4, .2), x.break=.1, x.reverse=TRUE)

jpeg(file = paste(fOutput, "VRI_",maxAge,"_",splineBy,"yrSpline.jpg", sep=""),
     height=5.25, width=2.2,
     units="in", res=300)
grid.draw(pP)
dev.off()

#########
### Overlapping Indexes #####
#VRI & PDSI
data = list(
  xdata = data.frame(scale(pPDSI[,'PDSI']), scale(pPollen[,'VRI'])),
  ydata = data.frame(as.numeric(pPDSI[,'CalYrBP']),
                     as.numeric(rownames(pPollen))),
  color = c("grey70", "springgreen4"),
  linetype = c("solid", "solid")
)
pX = palyoplot_plotOverlaidIndices(data=data, y.label="cal yr BP",
                         title="PDSI and VRI",
                         plot.style.color="springgreen4",
                         ylim=c(maxAge, minAge), y.break=200,
                         display.height=unit(3.25, "in"),
                         display.width=unit(1.25, "in"),
                         xlim=c(-.7, .2), x.break=.2, x.reverse=TRUE)
jpeg(file = paste(fOutput, "PDSI_VRI_Overlay_",maxAge,"_",splineBy,"yrSpline.jpg", sep=""),
     height=4.45, width=1.95,
     units="in", res=300)
grid.draw(pX)
dev.off()

data = list(
  xdata = data.frame(pPDSI2[,'PDSI'], pPollen[,'VRI']),
  ydata = data.frame(as.numeric(pPDSI2[,'CalYrBP']),
                     as.numeric(rownames(pPollen))),
  color = c("grey70", "springgreen4"),
  linetype = c("solid", "solid")
)

pX2 = palyoplot_plotOverlaidIndices(data=data, y.label="cal yr BP",
                                   title="VRI",
                                   plot.style.color="springgreen4",
                                   ylim=c(maxAge, minAge), y.break=100,
                                   display.height=unit(3.25, "in"),
                                   display.width=unit(1.25, "in"),
                                   xlim=c(-1.25, .4), x.break=.1, x.reverse=TRUE)
jpeg(file = paste(fOutput, "PDSI_VRI_Overlay047_",maxAge,"_",splineBy,"yrSpline.jpg", sep=""),
     height=4.25, width=1.95,
     units="in", res=300)
grid.draw(pX2)
dev.off()

# VRI, PDSI, Charcoal accum rate
data = list(
  xdata = data.frame((pPDSI2[,'PDSI']), (pPollen[,'VRI']), -((pCharcoal[,'char_accum']))),
#  xdata = data.frame(scale(pPDSI2[,'PDSI']), scale(pPollen[,'VRI']), -(scale(pCharcoal[,'char_accum'])-1.2)),
  ydata = data.frame(as.numeric(pPDSI[,'CalYrBP']),
                     as.numeric(rownames(pPollen)),
                     as.numeric(pCharcoal[,'age_Top'])),
  color = c("grey70", "springgreen4", 'darkgoldenrod'),
  linetype = c("solid", "solid", 'solid')
)
pX = palyoplot_plotOverlaidIndices(data=data, y.label="\n\ncal yr BP           ",
                                   title="PDSI, VRI, &\nCharcoal\nAccumulation",
                                   plot.style.color="springgreen4",
                                   ylim=c(maxAge, minAge), y.break=200,
                                   top.label.height = 3.25,
                                   display.height=unit(3.25, "in"),
                                   display.width=unit(1.25, "in"),
                                   xlim=c(-1.8, .4), x.break=1, x.reverse=TRUE)
#                                   xlim=c(-2.6, 2.3), x.break=1, x.reverse=TRUE) #scaled
#jpeg(file = paste(fOutput, "PDSI_VRI_CharCounts_Overlay_",maxAge,"_",splineBy,"yrSpline_clamScaled.jpg", sep=""),
jpeg(file = paste(fOutput, "PDSI_VRI_CharCounts_Overlay_",maxAge,"_",splineBy,"yrSpline_clamUnscaled.jpg", sep=""),
#jpeg(file = paste(fOutput, "PDSI_VRI_CharCounts_Overlay_",maxAge,"_",splineBy,"yrSpline_",sub("/","",dAgeSubDir),"ClamScaled.jpg", sep=""),
     height=4.45, width=1.95,
     units="in", res=300)
grid.draw(pX)
dev.off()


#####

## Charcoal accumulation spline
xdata = pCharcoal[,'char_accum']
ydata = data.frame(age=as.numeric(pCharcoal[,'age_Top']))
pC = palyoplot_plotIndex(x=xdata, y=ydata, y.label="cal yr BP",
                         title="Charcoal Spline",
                         ylim=c(maxAge, minAge), y.break=100,
                         xlim=c(0, 31), x.break=20, x.reverse=FALSE,
#                         y.show=FALSE,
                         plot.style='bar', plot.style.color = 'brown',
                         display.width=unit(30, "mm"))
jpeg(file = paste(fOutput, "Charcoal_",maxAge,"_",splineBy,"yrSpline.jpg", sep=""),
     height=5.25, width=2.2,
     units="in", res=300)
grid.draw(pC)
dev.off()

## Charcoal counts
xdata = Charcoal[,'total']
ydata = data.frame(age=as.numeric(Charcoal[,'age_Top']))
pC2 = palyoplot_plotIndex(x=xdata, y=ydata, y.label="cal yr BP",
                         title="Char Counts",
                         ylim=c(maxAge, minAge), y.break=100,
                         xlim=c(0, 62), x.break=20, x.reverse=FALSE,
#                         y.show=FALSE,
                         plot.style='bar', plot.style.color='brown',
                         display.width=unit(30, "mm"))
jpeg(file = paste(fOutput, "Charcoal_",maxAge,"_Counts.jpg", sep=""),
     height=5.25, width=2.2,
     units="in", res=300)
grid.draw(pC2)
dev.off()

## PDSI (from location)
xdata = pPDSI[,'PDSI']
ydata = data.frame(age=as.numeric(pPDSI[,'CalYrBP']))
p1 = palyoplot_plotIndex(x=xdata, y=ydata, y.label="cal yr BP",
                         title="PDSI",
                         plot.style.color="grey70",
                         ylim=c(maxAge, minAge), y.break=100,
                         xlim=c(-.62, .2), x.break=.2, x.reverse=TRUE,
#                         y.show=FALSE,
                         display.width=unit(30, "mm"))
jpeg(file = paste(fOutput, "PDSI_",maxAge,"_",splineBy,"yrSpline_NADA_Recon_JJA.jpg", sep=""),
     height=5.25, width=2.2,
     units="in", res=300)
grid.draw(p1)
dev.off()

## PDSI2 (cell 047)
xdata = pPDSI2[,'PDSI']
ydata = data.frame(age=as.numeric(pPDSI2[,'CalYrBP']))
p2 = palyoplot_plotIndex(x=xdata, y=ydata, y.label="cal yr BP",
                         title="PDSI (047)",
                         color="grey70",
                         ylim=c(maxAge, minAge), y.break=100,
                         xlim=c(-1.3, .35), x.break=.3, x.reverse=TRUE,
                         display.width=unit(40, "mm"))
jpeg(file = paste(fOutput, "PDSI_",maxAge,"_",splineBy,"yrSpline_047.jpg", sep=""),
     height=5.25, width=2.2,
     units="in", res=300)
grid.draw(p2)
dev.off()

## VRI & PDSI appended
p3 = palyoplot_appendGraphs(list(pP,p1), height=unit(5.25, "in"), widths=unit(c(2.2, 1.5), "in"))
jpeg(file = paste(fOutput, "Composite_",maxAge,"_",splineBy,"yrSpline_NADA_Recon_JJA_VRI.jpg", sep=""),
     height=5.25, width=4,
     units="in", res=300)
grid.draw(p3)
dev.off()

## VRI, PDSI, & Charcoal appended (all splined)
p3 = palyoplot_appendGraphs(list(pP,p1, pC), height=unit(5.25, "in"), widths=unit(c(2.2, 1.5, 1.5), "in"))
jpeg(file = paste(fOutput, "Composite_",maxAge,"_",splineBy,"yrSpline_NADA_Recon_JJA_VRI_CharcoalSpline.jpg", sep=""),
     height=5.25, width=5.5,
     units="in", res=300)
grid.draw(p3)
dev.off()

## VRI, PDSI, & Charcoal appended (Charcoal counts)
p4 = palyoplot_appendGraphs(list(pP,p1, pC2), height=unit(5.25, "in"), widths=unit(c(2.2, 1.5, 1.5), "in"))
jpeg(file = paste(fOutput, "Composite_",maxAge,"_",splineBy,"yrSpline_NADA_Recon_JJA_VRI_CharcoalCounts.jpg", sep=""),
     height=5.25, width=5.5,
     units="in", res=300)
grid.draw(p4)
dev.off()

##### END: Plot charts #####




###
##### START: Correlations between proxies #####
###
doCorrelations = function(cMinAge, cMaxAge){

  ptPollen = data.frame(as.integer(pPollen[,'Age']), pPollen[,'VRI'])
  colnames(ptPollen) = c('Age', 'VRI')
  ptPollen = ptPollen[dim(ptPollen)[1]:1,] #reverse the order so that calYrBP from the top
  ptPDSI = pPDSI[dim(pPDSI)[1]:1,] #reverse the order so that calYrBP from the top

  ptPollen   = ptPollen[(min(which(ptPollen[,'Age'] >= cMinAge))):(max(which(ptPollen[,'Age'] <= cMaxAge))),] #limit dataset to maxAge
  #ptCharcoal = pCharcoal[(min(which(pCharcoal[,2] >= cMinAge))):(max(which(pCharcoal[,2] <= cMaxAge))),] #limit dataset to maxAge
  ptPDSI = data.frame(ptPDSI[(min(which(ptPDSI[,'CalYrBP'] >= cMinAge))):(max(which(ptPDSI[,'CalYrBP'] <= cMaxAge))),]) #limit dataset to maxAge
  #ptCharcoal = ptCharcoal[,2:3]


  #cor.test(ptPollen[,2], -(ptCharcoal[,2]), conf.level=.95) #negative the charcoal b/c negative value = positive chance for fire
  cor.test(ptPollen[,'VRI'], ptPDSI[,'PDSI'], conf.level=.95, use="pairwise.complete.obs")
  #cor.test(-(ptCharcoal[,2]), ptPDSI[,2], conf.level=.95, use="pairwise.complete.obs")

  #cor(ptPollen, -(ptCharcoal), use="pairwise.complete.obs") #negative the charcoal b/c negative value = positive chance for fire
  #cor(ptPollen, ptPDSI, use="pairwise.complete.obs")
  #cor(-(ptCharcoal), ptPDSI, use="pairwise.complete.obs")
}
## limit to general time period of interest
#minAge = -70;
cMinAge = 1050; cMaxAge = 1550  #preMCA
doCorrelations(cMinAge, cMaxAge)
cMinAge = 700; cMaxAge = 1050   #MCA
doCorrelations(cMinAge, cMaxAge)
cMinAge = 500; cMaxAge = 700    #LIA transition
doCorrelations(cMinAge, cMaxAge)
cMinAge = 100; cMaxAge = 500    #LIA
doCorrelations(cMinAge, cMaxAge)
cMinAge = -53; cMaxAge = 100    #Modern
doCorrelations(cMinAge, cMaxAge)
cMinAge = 2000; cMaxAge = 100   #all
doCorrelations(cMinAge, cMaxAge)


install.packages("rcarbon")
library("rcarbon")

