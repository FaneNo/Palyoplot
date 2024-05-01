import styles from "../cssPages/aboutPage.module.css";
import ProfKP from "../assets/ProfKP.jpg"


function About() {
    return (
        <>
        
            <div className={`${styles.aboutPageBody}`}>
                <div className={`${styles.aboutDescripBox}`}>
                    <div className={`${styles.leftColumn}`}>
                        <h1 className={`${styles.aboutTitle}`}>Palyoplot: R Package</h1>
                        <p className={`${styles.aboutText}`}>
                            <b>TLDR:</b> An R package that simplifies the visualization and 
                            creation of multi-axis stratigraphic plotting of Quaternary 
                            Science Data
                        </p>
                        <p className={`${styles.aboutText}`}>
                            <b>Long version:</b> Palyoplot is an R package that adds
                            publication-quality Quaternary science data visualization
                            functions. Palyoplot implements customizable stratigraphical 
                            diagramming of proxy records such as pollen, sedimentary 
                            charcoal, and diatoms, and is appropriate for routine and 
                            scientific research use. It includes the ability to create 
                            standard stratigraphic plot by taxa, stacked taxa plots, and 
                            appending multiple plots to create one larger plot
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>Why use Palyoplot?</h2>
                        <ul style={{ textAlign: "left", marginLeft: 50 }}>
                            <li>-Create publication-quality stratigraphic plots, and in multiple formats (.jpg, .png, .pdf, etc)</li>
                            <li>-Customizable stratigraphic diagrams of proxy records (including point, line, bar, and stacked graphs)</li>
                            <li>-Reusable configuration files simplify processing and standardize your lab’s look-and-feel</li>
                            <li>-User-defined groups and ordered taxa</li>
                            <li>-Custom color application by group and/or taxa</li>
                            <li>-Multiple y-axes (ex: depth and age)</li>
                            <li>-Customizable y and x-axis intervals</li>
                            <li>-Exaggerated values (default 10x)</li>
                            <li>-Leverages ggPlot2, grid, gtable, scales, and data.table R packages</li>
                        </ul>
                        <h2 className={`${styles.aboutTitle}`}>The Palyoplot Way</h2>
                        <p className={`${styles.aboutText}`}>
                            R code automates the process and does the heavy lifting for. Contrain your data based on
                            your period of interest without having to edit files. Automtically extrapo- late and assign
                            your age model to your data. Dynamically convert your counts to percentages, and exclude
                            from drawing taxa that don’t meet a minimum threshold. Exclude entire groups from being
                            drawn (sub-setting your data). Ensure consistency in the order your data displays.

                            No more constantly having to adjust set- tings in software dialog boxes to get the 
                            look-and-feel you want! Maintain consis- tency of design between various studies and 
                            publications. Quickly and easily alter graphics for print vs presentations (font sizes, 
                            typeface, b/w vs. color, etc). 
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>WHERE CAN I GET PALYOPLOT TO SEE IF IT’S RIGHT FOR ME?</h2>
                        <p className={`${styles.aboutText}`}>
                            Palyoplot is in beta testing & available for download at:
                            http://geotechnography.com/samples/palyoplot. Sample data, configuration files, and documentation
                            are included in the package. Sample data and configuration files are also available on the 
                            download page.
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>How do I install Palyoplot?</h2>
                        <p className={`${styles.aboutText}`}>
                            To install using R Studio, go to Tools, Install Packages, Install 
                            from: Package archive file, then select the downloaded file 
                            (ex: palyoplot_0.0.8.tar.gz)
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>What support is there for getting help with setting this thing up?</h2>
                        <p className={`${styles.aboutText}`}>
                            There are help files in R (ex: ?palyoplot), sample files on the
                            download page, and a tutorial that doesn’t exist yet. It’s just
                            me, but feel free to contact me for assistance. I’m sure you can
                            figure out how (glances up at the Twitter (@eradani) and Facebook
                            icons) 😉 (darned spammers)
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>What genius created this amazing package?</h2>
                        <p className={`${styles.aboutText}`}>
                            Aww… *blush* thanks for asking! I’m Anna, an Assistant Professor
                            in the Geography Department at Sacramento State University 
                            (and the owner of this site). This package was born from 
                            frustration of dealing with software and workflow issues during 
                            my dissertation at the University of Nevada Reno (Go Wolfpack!), 
                            and wanting to simplify the process (it’s always the side 
                            projects that end up most useful, isn’t it?). I actually 
                            developed an entire workflow and database setup that synergizes 
                            with this package, if you’re interested.
                        </p>
                    </div>
                

                    <div className={`${styles.rightColumn}`}>
                        <h2 className={`${styles.aboutTitle}`}>About Anna</h2>
                        <div className={`${styles.imageRight}`}>
                            <img
                                src={ProfKP}
                                className={`${styles.imageSample}`}
                                alt="Picture of Professor KP"
                            />
                            <p className={`${styles.underImageText}`}>
                                Anna Klimaszewski-Patterson is an Associate Professor 
                                in the Geography Department at California State University,
                                Sacramento. She earned her Ph.D. in Geography from the 
                                University of Nevada, Reno in 2016. Her research focus is on
                                developing/implementing tools and geovisualizations to 
                                advance landscape sciences. Specifically, she's trained in
                                paleoecology, environmental archaeology, and landscape 
                                modeling. Her current area of application is the Sierra 
                                Nevada of California.
                            </p>
                            <p className={`${styles.underImageText}`}>
                                Her alter ego's super powers are: being one heck of a
                                programmer, graphic designer, cartographer, and not 
                                realizing there's a box you're supposed think in.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
          
        </>
    );
}

export default About;