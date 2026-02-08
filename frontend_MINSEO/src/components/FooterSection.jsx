import { motion } from "framer-motion";

const FooterSection = () => {
    return (
        <motion.footer
            id="footer"
            className="w-full text-white py-6 px-4 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            viewport={{ once: true }}
        >
            <div className="text-sm mb-2">
                {new Date().getFullYear()} DEVSIGN. All rights reserved.
            </div>
            <div className="flex justify-center space-x-4 text-xs">
                <a href="https://github.com/devclub" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                <a href="https://discord.gg/yourclub" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</a>
                <a href="mailto:devclub@example.com" className="hover:underline">Email</a>
            </div>
        </motion.footer>
    )
}

export default FooterSection;