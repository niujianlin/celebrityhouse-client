import { createRouter, createWebHashHistory } from 'vue-router'

let routes = [
    { path: "/", redirect: "/home" },
    { path: "/test", component: () => import("../views/Test.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    { path: "/detail", component: () => import("../views/Detail.vue") },
    { path: "/homeboard", component: () => import("../views/homepage/HomeBoard.vue")},
    { path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue") },
    {
        path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue"), children: [
            { path: "/dashboard/category", component: () => import("../views/dashboard/Category.vue") },
            { path: "/dashboard/article", component: () => import("../views/dashboard/Article.vue") },
            { path: "/dashboard/user", component: () => import("../views/dashboard/User.vue") },
            { path: "/dashboard/comment", component: () => import("../views/dashboard/Comment.vue") },
        ]
    },
    { path: "/home", component: () => import("../views/homepage/HomeBoard.vue")
     },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router, routes }