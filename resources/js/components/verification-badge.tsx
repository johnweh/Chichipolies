const styles: Record<string, string> = {
    'Unverified': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    'Likely True': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    'Likely False': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    'Disputed': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
};

export default function VerificationBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.Unverified}`}>
            {status}
        </span>
    );
}
