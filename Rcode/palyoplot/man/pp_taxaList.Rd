\name{pp_taxaList}
\alias{pp_taxaList}
\docType{data}
\title{Palyoplot sample of a list of taxa (data type: list)}
\description{
List of taxa including: id (ordered seq), life form type (see pp_lifeForms), taxa abbreviation code, taxa name, common name, merge under (if merging multiple taxa under one common name, using abbrev code), order (order to display, can be overall or within taxa group), and font style (plain, italic)
}
\usage{data("pp_taxaList")}
\format{
  A data frame with 77 observations on the following 8 variables.
  \describe{
    \item{\code{id}}{a numeric vector}
    \item{\code{life_id}}{a factor with levels \code{a} \code{c} \code{h} \code{m} \code{o} \code{p} \code{s} \code{t} \code{x} \code{z}}
    \item{\code{taxa_id}}{a factor with levels \code{ab} \code{ac} \code{ae} \code{al} \code{am} \code{ap} \code{ar} \code{at} \code{be} \code{br} \code{ca} \code{ce} \code{ch} \code{cn} \code{co} \code{cp} \code{cr} \code{cu} \code{cy} \code{en} \code{er} \code{fa} \code{fx} \code{ho} \code{hs} \code{in} \code{is} \code{l} \code{la} \code{li} \code{mo} \code{p} \code{pa} \code{pb} \code{pc} \code{pd} \code{pe} \code{pg} \code{ph} \code{pi} \code{pl} \code{pn} \code{po} \code{pp} \code{ppd} \code{ps} \code{pt} \code{pu} \code{px} \code{py} \code{q} \code{qr} \code{qs} \code{ro} \code{rx} \code{s} \code{sa} \code{sg} \code{sh} \code{sp} \code{st} \code{sx} \code{tl} \code{tr} \code{ts} \code{ty} \code{u1} \code{u2} \code{u3} \code{u4} \code{u5} \code{u6} \code{u7} \code{u8} \code{u9} \code{uk} \code{wy}}
    \item{\code{taxa_name}}{a factor with levels \code{Abies} \code{Alnus} \code{Amaranthaceae} \code{Ambrosia} \code{Apiaceae} \code{Arceuthobium} \code{Artemisia} \code{Asteracea} \code{Atriplex} \code{Betula} \code{Brassicaceae} \code{Caryophyllaceae} \code{Ceanothus} \code{Cercocarpus} \code{Chenopodiaceae} \code{Chrysolepis} \code{Chrysothamnus} \code{Corylus} \code{Cupressaceae} \code{Cyperaceae} \code{Ephedra nevadenses} \code{Eriogonum} \code{Fabaceae} \code{Fraxinus} \code{Holodiscus} \code{Indeterminate} \code{Isoetes} \code{Lamiaceae} \code{Liliaceae} \code{Lycopodium} \code{Monolete} \code{Pediastrum} \code{Pediastrum (unk)} \code{Pediastrum angulosum} \code{Pediastrum boryanum} \code{Pediastrum cornutum} \code{Pediastrum duplex} \code{Pediastrum integrum} \code{Pediastrum simplex} \code{Pinus} \code{Pinus (unknown)} \code{Pinus Dip} \code{Pinus Hap} \code{Plantago} \code{Poaceae} \code{Polemoniaceae} \code{Polygonaceae} \code{Polygonum} \code{Potentilla} \code{Pteridium} \code{Quercus} \code{Quercus (red)} \code{Quercus (white)} \code{Rosaceae} \code{Rumex} \code{Salix} \code{Salvia} \code{Sarcobatus} \code{Sequoia giganteum} \code{Shepherdia} \code{Sporomiella} \code{Stomates} \code{Trilete} \code{Tsuga} \code{Typha angustifolia} \code{Typha latifolia} \code{Unknown} \code{unknown 1} \code{unknown 2} \code{unknown 3} \code{unknown 4} \code{unknown 5} \code{unknown 6} \code{unknown 7} \code{unknown 8} \code{unknown 9} \code{Wyethia}}
    \item{\code{common_name}}{a factor with levels \code{Alder} \code{Amaranth} \code{Ash} \code{Aster} \code{Birch} \code{Brakenfern} \code{Buckwheat} \code{Buffaloberry} \code{Bush chinquapin} \code{Carrot or parsely} \code{Ceanothus} \code{Cinquefoil} \code{Common cattail} \code{Control} \code{Dock or sorrel} \code{Fern} \code{Fir} \code{Giant sequoia} \code{Goosefoot} \code{Grass} \code{Greasewood} \code{Green algae} \code{Hazelnut} \code{Indeterminate} \code{Juniper} \code{Knotweed} \code{Legume} \code{Lilies} \code{Mint} \code{misclassed} \code{Mistletoe} \code{Moss} \code{Mountain hemlock} \code{Mountain mahogany} \code{Mule\'s ear} \code{Mustards} \code{Narrow-leaf cattail} \code{Nevada ephedra} \code{Oak} \code{Oak, red} \code{Oak, white} \code{Ocean spray} \code{Pediastrum} \code{Phlox} \code{Pine} \code{Pine, white} \code{Pine, yellow} \code{Pink or carnation} \code{Quillworts} \code{Rabbitbrush} \code{Ragweed} \code{Roses} \code{Sagebrush} \code{Saltbush} \code{Sedge} \code{Stomate} \code{Unknown} \code{Wild buckwheat} \code{Willow}}
    \item{\code{merge_under}}{a factor with levels \code{ab} \code{ac} \code{ae} \code{al} \code{am} \code{ap} \code{ar} \code{be} \code{br} \code{ca} \code{cn} \code{co} \code{cp} \code{cu} \code{cy} \code{en} \code{fa} \code{fx} \code{hs} \code{in} \code{is} \code{l} \code{la} \code{li} \code{mo} \code{pe} \code{pl} \code{po} \code{pp} \code{ppd} \code{pt} \code{py} \code{q} \code{ro} \code{s} \code{sh} \code{sp} \code{st} \code{sx} \code{tl} \code{tr} \code{ts} \code{ty} \code{uk}}
    \item{\code{order}}{a factor with levels \code{1} \code{2} \code{3} \code{4} \code{5} \code{6} \code{7} \code{8} \code{9} \code{NULL}}
    \item{\code{fontstyle}}{a factor with levels \code{italic} \code{plain}}
  }
}
\examples{
data(pp_taxaList)

#get list of taxa based on thr taxa group they belong to
palyoplot_getTaxaNamesByGroup(data=pp_xdata, taxaList=pp_taxaList,
                              group=c('a', 'c'), group.field.id='life_id',
                              taxaList.field.id="taxa_name")

#group taxa
taxaGroups = palyoplot_getTaxaGroups(pp_lifeForms, pp_taxaList, data=pp_xdata,
                                     data.taxa.col.start=1,
                                     data.taxa.col.end=length(pp_xdata))

#get font style for each taxa
palyoplot_getFontStyles(pp_taxaList, data=pp_xdata,
                        taxaList.field.style="fontstyle",
                        taxaList.field.text="taxa_name")
}
\keyword{datasets}
