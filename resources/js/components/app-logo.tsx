import BrandMark from '@/components/brand-mark';

export default function AppLogo() {
    return (
        <>
            <BrandMark className="size-8 rounded-lg" charClass="text-sm" starClass="top-1 right-1 size-1.5" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="font-display mb-0.5 truncate leading-none font-semibold">Chichipolies</span>
            </div>
        </>
    );
}
