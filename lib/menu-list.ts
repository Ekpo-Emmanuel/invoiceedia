import {
    Tag,
    Users,
    Settings,
    Bookmark,
    SquarePen,
    LayoutGrid,
    LucideIcon,

    House,
    Newspaper,
    User,
    BellDot
  } from "lucide-react";
  
  type Submenu = {
    href: string;
    label: string;
    active?: boolean;
  };
  
  type Menu = {
    href: string;
    label: string;
    active?: boolean;
    icon: LucideIcon;
    submenus?: Submenu[];
  };
  
  type Group = {
    groupLabel: string;
    menus: Menu[];
  };
  
  export function getMenuList(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/",
            label: "Home",
            icon: House,
            submenus: []
          },
          {
            href: "/clients",
            label: "Clients",
            icon: Users
          },
          {
            href: "/invoices",
            label: "Invoices",
            icon: Newspaper
          },
        ]
      },
      {
        groupLabel: "Settings",
        menus: [
          {
            href: "/settings",
            label: "settings",
            icon: Settings,
            submenus: []
          },
          {
            href: "/account",
            label: "Account",
            icon: User
          },
          {
            href: "/notification",
            label: "Notifications",
            icon: BellDot
          },
        ]
      },
      // {
      //   groupLabel: "Contents",
      //   menus: [
      //     {
      //       href: "",
      //       label: "Posts",
      //       icon: SquarePen,
      //       submenus: [
      //         {
      //           href: "/posts",
      //           label: "All Posts"
      //         },
      //         {
      //           href: "/posts/new",
      //           label: "New Post"
      //         }
      //       ]
      //     },
      //     {
      //       href: "/categories",
      //       label: "Categories",
      //       icon: Bookmark
      //     },
      //     {
      //       href: "/tags",
      //       label: "Tags",
      //       icon: Tag
      //     }
      //   ]
      // },
    ];
  }