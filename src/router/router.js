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
        {
            path: "addTask",
            title: "添加任务",
            name: "addTask",
            component: () => import("@/views/teachManage/addTask.vue")
        },
        {
            path: "taskInfo",
            title: "查看任务",
            name: "addTask",
            component: () => import("@/views/teachManage/taskInfo.vue")
        },
        {
            path: "editTask",
            title: "编辑任务",
            name: "editTask",
            component: () => import("@/views/teachManage/editTask.vue")
        },
        {
            path: "addReport",
            title: "提交实验报告",
            name: "addReport",
            component: () => import("@/views/teachManage/addReport.vue")
        },
        {
            path: "reportInfo",
            title: "查看实验报告",
            name: "reportInfo",
            component: () => import("@/views/teachManage/reportInfo.vue")
        },
        {
            path: "editReport",
            title: "报告评分",
            name: "editReport",
            component: () => import("@/views/teachManage/editReport.vue")
        },
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
                path: "labIndex1",
                icon: "i iconfont icon-guanli",
                title: "实验室管理",
                name: "labIndex1",
                access: 1,
                component: () => import("@/views/labManage/index")
            },
            {
                path: "labApprovalManage1",
                icon: "i iconfont icon-guanli",
                title: "实验室申请",
                name: "labApprovalManage1",
                access: 1,
                component: () => import("@/views/labManage/myLabApply")
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
                path: "devSortManage",
                icon: "i iconfont icon-guanli",
                title: "设备分类管理",
                name: "devSortManage",
                access: 0,
                component: () => import("@/views/deviceManage/devSortManage")
            },
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
        path: "/repairApply",
        icon: "i iconfont icon-my_shezhi_ico",
        name: "deviceManage",
        access: 1,
        title: "设备管理",
        component: Main,
        children: [
            {
                path: "useManage1",
                icon: "i iconfont icon-guanli",
                title: "使用与分配",
                name: "useManage1",
                access: 1,
                component: () => import("@/views/deviceManage/useManage1")
            },
            {
                path: "repairApply",
                icon: "i iconfont icon-guanli",
                title: "设备报修申请",
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
