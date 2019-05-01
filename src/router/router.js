import Main from "@/views/Main.vue";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: "/login",
    name: "login",
    meta: {
        title: "Login - 登录"
    },
    component: () => import("@/views/login.vue")
};

export const page404 = {
    path: "/*",
    name: "error-404",
    meta: {
        title: "404-页面不存在"
    },
    component: () => import("@/views/error-page/404.vue")
};

export const page403 = {
    path: "/403",
    meta: {
        title: "403-权限不足"
    },
    name: "error-403",
    component: () => import("@//views/error-page/403.vue")
};

export const page500 = {
    path: "/500",
    meta: {
        title: "500-服务端错误"
    },
    name: "error-500",
    component: () => import("@/views/error-page/500.vue")
};

export const locking = {
    path: "/locking",
    name: "locking",
    component: () =>
        import("@/views/main-components/lockscreen/components/locking-page.vue")
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: "/",
    name: "otherRouter",
    redirect: "/home",
    component: Main,
    children: [
        {
            path: "home",
            title: "首页",
            name: "home_index",
            component: () => import("@/views/home/home.vue")
        },
        // {
        //     path: "addStore",
        //     title: "新增店铺",
        //     name: "addStore",
        //     component: () => import("@/views/storeManagement/storeInfo.vue")
        // },
        // {
        //     path: "editStore",
        //     title: "编辑店铺",
        //     name: "editStore",
        //     component: () => import("@/views/storeManagement/storeInfo.vue")
        // },
        // {
        //     path: "staffManagement",
        //     title: "员工管理",
        //     name: "staffManagement",
        //     component: () => import("@/views/storeManagement/staffManagement.vue")
        // },
        // {
        //     path: "addVideo",
        //     title: "新增视频",
        //     name: "addVideo",
        //     component: () => import("@/views/operationManagement/videoDetail.vue")
        // },
        // {
        //     path: "editVideo",
        //     title: "编辑视频",
        //     name: "editVideo",
        //     component: () => import("@/views/operationManagement/videoDetail.vue")
        // },
        // {
        //     path: "addArticle",
        //     title: "新增文章",
        //     name: "addArticle",
        //     component: () => import("@/views/operationManagement/articleDetail.vue")
        // },
        // {
        //     path: "editArticle",
        //     title: "编辑文章",
        //     name: "editArticle",
        //     component: () => import("@/views/operationManagement/articleDetail.vue")
        // },
        // {
        //     path: "addBanner",
        //     title: "新增轮播图",
        //     name: "addBanner",
        //     component: () => import("@/views/operationManagement/bannerDetail.vue")
        // },
        // {
        //     path: "editBanner",
        //     title: "编辑轮播图",
        //     name: "editBanner",
        //     component: () => import("@/views/operationManagement/bannerDetail.vue")
        // },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: "/userManage",
        icon: "i iconfont icon-kehuhuiyuanguanli",
        name: "userManage",
        access: 0,
        title: "账户管理",
        component: Main,
        children: [
            {
                path: "userIndex",
                icon: "i iconfont icon-guanli",
                title: "账户管理",
                name: "userIndex",
                access: 0,
                component: () => import("@/views/userManage/index")
            },
            {
                path: "pemissionManage",
                icon: "i iconfont icon-guanli",
                title: "身份与权限",
                name: "pemissionManage",
                access: 0,
                component: () => import("@/views/userManage/pemissionManage")
            }
        ]
    },
    {
        path: "/labManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "labManage",
        access: 0,
        title: "实验室管理",
        component: Main,
        children: [
            {
                path: "labIndex",
                icon: "i iconfont icon-guanli",
                title: "实验室管理",
                name: "labIndex",
                access: 0,
                component: () => import("@/views/labManage/index")
            },
            {
                path: "labApprovalManage",
                icon: "i iconfont icon-guanli",
                title: "实验室审批",
                name: "labApprovalManage",
                access: 0,
                component: () => import("@/views/labManage/labApprovalManage")
            },
        ]
    },
    {
        path: "/labManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "labManage",
        access: 1,
        title: "实验室管理",
        component: Main,
        children: [
            {
                path: "labIndex",
                icon: "i iconfont icon-guanli",
                title: "实验室管理",
                name: "labIndex",
                access: 1,
                component: () => import("@/views/labManage/index")
            },
            {
                path: "labApprovalManage",
                icon: "i iconfont icon-guanli",
                title: "实验室申请",
                name: "labApprovalManage",
                access: 1,
                component: () => import("@/views/labManage/labApprovalManage")
            },
        ]
    },
    {
        path: "/deviceManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "deviceManage",
        access: 0,
        title: "设备管理",
        component: Main,
        children: [
            {
                path: "useManage",
                icon: "i iconfont icon-guanli",
                title: "使用与分配",
                name: "useManage",
                access: 0,
                component: () => import("@/views/deviceManage/useManage")
            },
            {
                path: "storeManage",
                icon: "i iconfont icon-guanli",
                title: "库存管理",
                name: "storeManage",
                access: 0,
                component: () => import("@/views/deviceManage/storeManage")
            },
            {
                path: "deviceIndex",
                icon: "i iconfont icon-guanli",
                title: "设备管理",
                name: "deviceIndex",
                access: 0,
                component: () => import("@/views/deviceManage/deviceManage")
            },
            {
                path: "applyManage",
                icon: "i iconfont icon-guanli",
                title: "设备申请",
                name: "applyManage",
                access: 0,
                component: () => import("@/views/deviceManage/applyManage")
            },
        ]
    },
    {
        path: "/deviceManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "deviceManage",
        access: 2,
        title: "设备管理",
        component: Main,
        children: [
            {
                path: "useManage",
                icon: "i iconfont icon-guanli",
                title: "使用与分配",
                name: "useManage",
                access: 2,
                component: () => import("@/views/deviceManage/useManage")
            },
            {
                path: "storeManage",
                icon: "i iconfont icon-guanli",
                title: "库存管理",
                name: "storeManage",
                access: 2,
                component: () => import("@/views/deviceManage/storeManage")
            },
            {
                path: "deviceIndex",
                icon: "i iconfont icon-guanli",
                title: "设备管理",
                name: "deviceIndex",
                access: 2,
                component: () => import("@/views/deviceManage/deviceManage")
            },
        ]
    },
    {
        path: "/deviceManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "deviceManage",
        access: 1,
        title: "设备管理",
        component: Main,
        children: [
            {
                path: "repairApply",
                icon: "i iconfont icon-guanli",
                title: "报修申请",
                name: "repairApply",
                access: 1,
                component: () => import("@/views/deviceManage/repairApply")
            },
        ]
    },
    {
        path: "/devPurchase",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "devPurchase",
        access: 0,
        title: "设备采购",
        component: Main,
        children: [
            {
                path: "devSortManage",
                icon: "i iconfont icon-guanli",
                title: "设备分类",
                name: "devSortManage",
                access: 0,
                component: () => import("@/views/devPurchase/devSortManage")
            },
            {
                path: "purchaseApply",
                icon: "i iconfont icon-guanli",
                title: "采购审批",
                name: "purchaseApply",
                access: 0,
                component: () => import("@/views/devPurchase/purchaseApply")
            },
        ]
    },
    {
        path: "/devPurchase",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "devPurchase",
        access: 2,
        title: "设备采购",
        component: Main,
        children: [
            {
                path: "devSortManage",
                icon: "i iconfont icon-guanli",
                title: "设备分类",
                name: "devSortManage",
                access:2,
                component: () => import("@/views/devPurchase/devSortManage")
            },
            {
                path: "purchaseApply",
                icon: "i iconfont icon-guanli",
                title: "采购申请",
                name: "purchaseApply",
                access: 2,
                component: () => import("@/views/devPurchase/purchaseApply")
            },
        ]
    },
    {
        path: "/teachManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "teachManage",
        access: 1,
        title: "教务管理",
        component: Main,
        children: [
            {
                path: "studentManage",
                icon: "i iconfont icon-guanli",
                title: "学生管理",
                name: "studentManage",
                access: 1,
                component: () => import("@/views/teachManage/studentManage")
            },
            {
                path: "teachList",
                icon: "i iconfont icon-guanli",
                title: "课程管理",
                name: "teachList",
                access: 1,
                component: () => import("@/views/teachManage/teachList")
            },
            {
                path: "experimentTask",
                icon: "i iconfont icon-guanli",
                title: "实验任务",
                name: "experimentTask",
                access: 1,
                component: () => import("@/views/teachManage/experimentTask")
            },
            {
                path: "experimentReport",
                icon: "i iconfont icon-guanli",
                title: "实验报告",
                name: "experimentReport",
                access: 1,
                component: () => import("@/views/teachManage/experimentReport")
            },
            {
                path: "scoreManage",
                icon: "i iconfont icon-guanli",
                title: "成绩管理",
                name: "scoreManage",
                access: 1,
                component: () => import("@/views/teachManage/scoreManage")
            },
        ]
    },
    {
        path: "/teachManage",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "teachManage",
        access: 3,
        title: "教务管理",
        component: Main,
        children: [
            {
                path: "teachList",
                icon: "i iconfont icon-guanli",
                title: "课程管理",
                name: "teachList",
                access: 3,
                component: () => import("@/views/teachManage/teachList")
            },
            {
                path: "experimentTask",
                icon: "i iconfont icon-guanli",
                title: "实验课题",
                name: "experimentTask",
                access: 3,
                component: () => import("@/views/teachManage/experimentTask")
            },
            {
                path: "experimentReport",
                icon: "i iconfont icon-guanli",
                title: "实验报告",
                name: "experimentReport",
                access: 3,
                component: () => import("@/views/teachManage/experimentReport")
            },
            {
                path: "scoreManage",
                icon: "i iconfont icon-guanli",
                title: "成绩管理",
                name: "scoreManage",
                access: 3,
                component: () => import("@/views/teachManage/scoreManage")
            },
        ]
    },

    // {
    //     path: "/orderManagement",
    //     icon: "i iconfont icon-dingdan",
    //     name: "orderManagement",
    //     access: 0,
    //     title: "订单管理",
    //     component: Main,
    //     children: [
    //         {
    //             path: "rechargeOrder",
    //             icon: "i iconfont icon-guanli",
    //             title: "充值订单",
    //             name: "rechargeOrder",
    //             access: 0,
    //             component: () => import("@/views/orderManagement/rechargeOrder")
    //         },
    //         {
    //             path: "consumeOrder",
    //             icon: "i iconfont icon-guanli",
    //             title: "消费订单",
    //             name: "consumeOrder",
    //             access: 0,
    //             component: () => import("@/views/orderManagement/consumeOrder")
    //         },
    //     ]
    // },
    // {
    //     path: "/operationManagement",
    //     icon: "i iconfont icon-gerenhaoyunyinggongju",
    //     name: "operationManagement",
    //     access: 0,
    //     title: "运营管理",
    //     component: Main,
    //     children: [
    //         {
    //             path: "videoManage",
    //             icon: "i iconfont icon-guanli",
    //             title: "视频管理",
    //             name: "videoManage",
    //             access: 0,
    //             component: () => import("@/views/operationManagement/index")
    //         },
    //         {
    //             path: "articleManage",
    //             icon: "i iconfont icon-guanli",
    //             title: "文章管理",
    //             name: "articleManage",
    //             access: 0,
    //             component: () => import("@/views/operationManagement/articleManage")
    //         },
    //         {
    //             path: "extensionManage",
    //             icon: "i iconfont icon-guanli",
    //             title: "素材管理（推广）",
    //             name: "extensionManage",
    //             access: 0,
    //             component: () => import("@/views/operationManagement/extensionManage")
    //         },
    //         {
    //             path: "uploadBanner",
    //             icon: "i iconfont icon-guanli",
    //             title: "轮播图管理",
    //             name: "uploadBanner",
    //             access: 0,
    //             component: () => import("@/views/operationManagement/uploadBanner")
    //         },
    //     ]
    // },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
