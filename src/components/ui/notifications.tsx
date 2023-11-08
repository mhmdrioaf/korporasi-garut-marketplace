"use client";

import { useNotifications } from "@/lib/hooks/context/useNotifications";
import { Button } from "./button";
import { BellIcon,  Loader2Icon,  MailOpenIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { TNotificationItem } from "@/lib/globals";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { getDateString } from "@/lib/helper";

export function NotificationTrigger() {
    const { data, handler } = useNotifications();

    const notificationItems = data.notification ? data.notification.items : [];
    const unreadNotificationItems = notificationItems.filter((item) => item.status === "UNREAD");
    const totalUnreadNotificationItems = unreadNotificationItems.length;

    return (
        <Button variant="ghost" onClick={handler.toggleOpen} size="icon">
            {totalUnreadNotificationItems > 0 ? (
                <div className="relative">
                    <BellIcon className="w-4 h-4" />
                    <div className="w-6 h-6 text-xs rounded-full p-1 text-center bg-destructive text-destructive-foreground absolute -top-4 -right-4">
                        {totalUnreadNotificationItems}
                    </div>
                </div>
            ) : (
                <BellIcon className="w-4 h-4" />
            )}
        </Button>
    )
}

export function NotificationCard({ notification, variant }: { notification: TNotificationItem, variant: VariantProps<typeof notificationCardVariants>["variant"] }) {
    const notificationCardVariants = cva(
        "w-full rounded-sm shadow-sm flex flex-row items-center gap-2 p-4 relative font-bold",
        {
            variants: {
                variant: {
                    default: "border-l-4 border-primary",
                    read: "border-l-4 border-input font-normal"
                }
            },
            defaultVariants: {
                variant: "default"
            }
        }
    )
    return (
        <div className={cn(notificationCardVariants({ variant }))}>
            <div className="w-full flex flex-col gap-1">
                <div className="w-full flex flex-row items-center justify-between">
                    <p>{notification.title}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                                <MoreVerticalIcon className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            {notification.status === "UNREAD" && (
                                <DropdownMenuItem>
                                <Button className="w-full items-center justify-start" variant="ghost" size="sm">
                                    <MailOpenIcon className="w-4 h-4 mr-2" />
                                    <span>Tandai telah dibaca</span>
                                </Button>
                            </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                                <Button className="w-full items-center justify-start" variant="ghost" size="sm">
                                    <Trash2Icon className="w-4 h-4 mr-2" />
                                    <span>Hapus notifikasi</span>
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="font-light text-xs">{getDateString(notification.notifiedAt)}</p>
                {notification.show_action_button && (
                    <>
                        <Separator />
                        <Button variant="default" size="sm" asChild>
                            <Link href={notification.redirect_url ?? "/user/dashboard/orders"}>
                                <p>Lihat Pesanan</p>
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

export function NotificationContent({ className }: { className?: string }) {
    const { data, state } = useNotifications();

    return state.isOpen ? (
        <div className={`w-96 min-h-[16rem] max-h-[28rem] rounded-md shadow-lg bg-white border border-input overflow-auto ${className}`}>

            <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col sticky top-0 left-0 bg-background border-b border-b-input p-4 z-50">
                    <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-xl font-bold text-primary">Notifikasi</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" size="icon">
                                    <MoreVerticalIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Button className="w-full items-center justify-start" variant="ghost" size="sm">
                                        <MailOpenIcon className="w-4 h-4 mr-2" />
                                        <span>Tandai semua telah dibaca</span>
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button className="w-full items-center justify-start" variant="ghost" size="sm">
                                        <Trash2Icon className="w-4 h-4 mr-2" />
                                        <span>Hapus semua notifikasi</span>
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <p className="text-xs text-stone-500">Berikut merupakan notifikasi yang diterima dari SMKs Korporasi Garut Marketplace</p>
                </div>

                <div className="w-full flex flex-col gap-4 p-4">    
                    {state.loading && (
                        <div className="w-full min-h-[16rem] flex flex-col gap-2 items-center justify-center">
                            <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
                            <p className="font-light text-sm">Memuat notifikasi...</p>
                        </div>
                    )}
                    {!state.loading && data.notification && data.notification.items.length > 0 && data.notification.items.map((notification) => (
                        <NotificationCard notification={notification} variant={notification.status === "UNREAD" ? "default" : "read"} key={notification.notification_item_id} />
                    ))}
                    {data.notification && data.notification.items.length < 1 && (
                        <div className="w-full h-[16rem] grid place-items-center">
                            <p className="font-light text-sm">Untuk saat ini tidak ada notifikasi untuk anda.</p>
                        </div>
                    )}
                    {state.error && (
                        <p className="font-light">Gagal memuat notifikasi, silahkan coba lagi nanti.</p>
                    )}
                </div>
            </div>
        </div>
    ) : null
}