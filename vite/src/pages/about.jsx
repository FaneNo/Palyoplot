import styles from "../cssPages/aboutPage.module.css";
import ProfKP from "../assets/ProfKP.jpg"


function About() {
    return (
        <>
        
            <div className={`${styles.aboutPageBody}`}>
                <div className={`${styles.aboutDescripBox}`}>
                    <div className={`${styles.leftColumn}`}>
                        <h1 className={`${styles.aboutTitle}`}>Palyoplot: A Modern Web Application for Stratigraphic Plotting</h1>
                        <p className={`${styles.aboutText}`}>
                            <b>TLDR:</b> An innovative web application that simplifies the visualization and creation of multi-axis stratigraphic plots for Quaternary science data.
                        </p>
                        <p className={`${styles.aboutText}`}>
                            <b>Long version:</b> Palyoplot has evolved from its original R package into a powerful, user-friendly web application developed by our dedicated team. 
                            This new version retains the core functionality of creating publication-quality stratigraphic diagrams while enhancing usability and accessibility. 
                            Palyoplot facilitates the visualization of proxy records such as pollen, sedimentary charcoal, and diatoms, making it suitable for both routine use and advanced scientific research.
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>Why use Palyoplot?</h2>
                            <li>User-Friendly Interface: Intuitive web-based platform requiring no programming expertise</li>
                            <li>Publication-Quality Plots: Generate high-resolution stratigraphic diagrams suitable for academic journals and presentations in various formats (e.g., .jpg, .png, .pdf)</li>
                            <li>Customizable Diagrams: Create fully customizable plots, including area, line, and bar</li>
                            <li>User-Defined Groups and Taxa: Easily define and order taxa groups according to your research needs</li>
                            <li>Advanced Color Customization: Apply custom colors to groups and taxa for enhanced data visualization</li>
                            <li>Multiple Y-Axes Support: Plot data against multiple y-axes (e.g., depth and age) for comprehensive stratigraphic analysis</li>
                            <li>Twitter: https://twitter.com/eradani</li>
                        <h2 className={`${styles.aboutTitle}`}>Where Can I Try the New Palyoplot?</h2>
                        <p className={`${styles.aboutText}`}>
                            Palyoplot is now available as a web application, and you are on it! A comprehensive tutorial is provided to help you get started quickly.
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>How Do I Get Started with Palyoplot?</h2>
                        <p className={`${styles.aboutText}`}>
                            Create an Account: Sign up to access all features and save your configurations.
                            Upload Your Data: Use our straightforward interface to upload CSV or Excel files.
                            Customize Your Plot: Utilize our tools to define groups, select taxa, and customize visual settings.
                            Generate and Export: Create your stratigraphic plot and export it in your preferred format.
                            Support and Assistance
                            I am committed to helping you make the most of Palyoplot. For assistance with setting up and using the application, please contact me, our lead developer and support specialist. You can reach me via email at anna.kp@csus.edu
                        </p>
                        <h2 className={`${styles.aboutTitle}`}>What support is there for getting help with setting this thing up?</h2>
                        <li>It’s just me, but feel free to <a href="mailto:anna@example.com">contact me</a> for assistance.</li>
                        <li>Follow me on <a href="https://twitter.com/eradani" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li>Visit my <a href="https://www.facebook.com/geotechnography" target="_blank" rel="noopener noreferrer">Facebook page</a></li>
                        <li>Subscribe to my <a href="http://geotechnography.com/feed" target="_blank" rel="noopener noreferrer">RSS Feed</a></li>
                        <h2 className={`${styles.aboutTitle}`}>What genius created this amazing application?</h2>
                        <p className={`${styles.aboutText}`}>
                            Aww… *blush* thanks for asking! I’m Anna, an Assistant Professor
                            in the Geography Department at Sacramento State University 
                            (and the owner of this site). This application was born from 
                            frustration of trying to allow others to use the R package predecessor, 
                            and wanting to simplify the process for those not familiar with coding (it’s always the side 
                            projects that end up most useful, isn’t it?).
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