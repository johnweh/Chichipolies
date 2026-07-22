import { GearSix, ShieldCheck, SignOut } from '@phosphor-icons/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link } from '@inertiajs/react';

interface UserMenuProps {
    user: { name: string; email?: string; is_admin?: boolean };
}

const item =
    'flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 data-[highlighted]:bg-secondary';

export default function UserMenu({ user }: UserMenuProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    aria-label="Account menu"
                    className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground uppercase transition-all duration-300 ease-fluid hover:ring-2 hover:ring-ring/30 active:scale-95 data-[state=open]:ring-2 data-[state=open]:ring-ring/40"
                >
                    {user.name.charAt(0)}
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={10}
                    className="z-50 w-56 rounded-2xl border border-border/70 bg-card p-1.5 shadow-soft data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                >
                    <div className="px-3 pt-2 pb-2.5">
                        <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                        {user.email && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
                    </div>
                    <DropdownMenu.Separator className="mx-1 mb-1 h-px bg-border/70" />
                    <DropdownMenu.Item asChild>
                        <Link href="/settings/profile" className={item}>
                            <GearSix weight="light" className="size-4 text-muted-foreground" />
                            Settings
                        </Link>
                    </DropdownMenu.Item>
                    {user.is_admin && (
                        <DropdownMenu.Item asChild>
                            <Link href="/admin" className={item}>
                                <ShieldCheck weight="light" className="size-4 text-muted-foreground" />
                                Admin
                            </Link>
                        </DropdownMenu.Item>
                    )}
                    <DropdownMenu.Item asChild>
                        <Link href={route('logout')} method="post" as="button" className={item}>
                            <SignOut weight="light" className="size-4 text-muted-foreground" />
                            Sign out
                        </Link>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
