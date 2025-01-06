import Link from "next/link";
import LogoSvg from "../logo-svg";


export default function V2LogoSvg() {
    return (
        <Link href="/" className="flex items-end">
            <LogoSvg className="fill-primary"/>
        </Link>
    )
}