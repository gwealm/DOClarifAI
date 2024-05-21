import { ParallaxGlare } from "../components/utils/ParallaxGlare";

export function AboutUs() {
    const developers = [
        {
            name: "João Malva",
            role: "CEO",
            imagePath: "/joao.png",
        },
        {
            name: "Guilherme Almeida",
            role: "CEO",
            linkedin: "https://www.linkedin.com/in/limwa/",
            website: "https://www.gui1612.github.io",
            imagePath: "/guilherme.jpg",
        },        {
            name: "Maria Monteiro",
            role: "CSO",
            imagePath: "/maria.png",
        },        {
            name: "Miguel Teixeira",
            role: "CSO",
            imagePath: "/jose.png",
        },        {
            name: "Pedro Gomes",
            role: "CTO",
            imagePath: "/pedro.png",
        },        {
            name: "Rui Pires",
            role: "CTO",
            imagePath: "/rui.png",
            linkedin: "https://www.linkedin.com/in/rui-piress/",
        },        {
            name: "Luísa Salvador",
            role: "CPO",
            imagePath: "/luisa.png",
        },        {
            name: "Martim Videira",
            role: "Developer",
            imagePath: "/martim.png",
        },        {
            name: "Bárbara Caravalho",
            role: "Developer",
            imagePath: "/barbara.png",
        }
    ];

    return (
        <>
            <main>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded ">
                    <div className="text-left text-lg text-gray-400">
                        <h1 className="text-3xl font-bold mb-4 text-center">
                            About Us
                        </h1>
                        <p className="mb-6">
                            Our team at WeClarifAI is a blend of diverse expertise and backgrounds. Led by Guilherme Almeida and João Malva as CEOs, Maria Monteiro and Miguel Teixeira as CSOs, Pedro Gomes and Rui Pires as CTOs, and Luísa Salvador and Martim Videira as CPOs. Developers Bárbara Carvalho and Diogo Câmara support our commitment to excellence and customer satisfaction, providing advanced solutions in data management and decision-making support.
                        </p>
                        <h2 className="text-2xl mb-6 font-bold">
                            Our Drive 🚀:
                        </h2>
                        <p className="mb-6">
                            We're on a mission to unleash the full potential of your data, driving innovation and fostering sustainable growth in an increasingly digital world.
                        </p>
                        <h2 className="text-2xl mb-6 font-bold">
                            Core Values 🌟:
                        </h2>
                        <p className="mb-6">
                            Transparency, Availability, Continuous Improvement, and a Willingness to Embrace Big Challenges guide our every move.
                        </p>
                        <h2 className="text-2xl mb-6 font-bold">
                            Introducing DOClarifAI 🚀:
                        </h2>
                        <p className="mb-6">
                            DOClarifAI is our innovative solution tailored for the digital age. With features like streamlined workflow orchestration, manual document input capability, and export functionality for results, we empower your organization to make informed decisions efficiently.
                        </p>
                        <h2 className="text-2xl mb-6 font-bold">
                            The Vision 🌐:
                        </h2>
                        <p className="mb-6">
                            DOClarifAI positions itself in the B2B space, offering solutions that streamline document management and facilitate digital transition. We cater to organizations seeking to increase productivity with the SAP Business Technology Platform.
                        </p>
                        <p className="mb-6">
                            B2C interactions are integral to our approach, enhancing end-user experience and, consequently, the appreciation of our core B2B clients for DOClarifAI's services.
                        </p>
                    </div>


                    <div>
                        <h1 className="text-3xl font-bold mb-4 text-center">
                            Team
                        </h1>
                        <div className="flex flex-wrap justify-center">
                            {developers.map((developer, index) => (
                                <ParallaxGlare
                                    key={index}
                                    data={developer}
                                    border={true}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
