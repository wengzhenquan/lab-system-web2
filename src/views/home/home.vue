<template>
    <div>
        <div class="box home">
            <div class="home-box">
                <div class="home-box-img">
                    <img src="@/images/1.jpg">
                    <img src="@/images/2.jpg">
                    <img src="@/images/3.jpg">
                    <img src="@/images/4.jpg">
                </div>
                <div class="home-box-cont">
                    <p>教学管理<span>教师 学生</span></p>
                    <p>为了提高教学质量，节约教师的工作时间。教师可以再本模块管理教学任务，
                        发布课题，发布实验任务，查看学生提交的实验报告，评定学生的成绩。
                    </p>
                    <p>
                        学生可以在此模块选课，查看实验任务，提交实验报告。
                    </p>
                </div>
            </div>
            <hr>
            <div class="home-box1">
                <div class="home-box1-cont1">
                    <p>实验室管理<span>教师 系统管理员</span></p>
                    <p>本模块主要对于实验室教室的使用情况进行管理。</p>
                    <p>系统管理员在本模块录入教室信息，由教师申请授课使用。系统管理员对实验室的布置进行管理。</p>
                    <p>系统针对实验室布置有详细介绍，教师申请使用后，系统自动监控实验室实验室实验室状态。</p>
                </div>
                <div class="home-box1-img1">
                    <img src="@/images/5.jpg">
                    <img src="@/images/6.jpg">
                    <img src="@/images/7.jpg">
                    <img src="@/images/8.jpg">
                </div>
            </div>
            <hr>
            <div class="home-box2">
                <div class="home-box2-img">
                    <img src="@/images/9.jpg">
                    <img src="@/images/10.jpg">
                    <img src="@/images/11.jpg">
                    <img src="@/images/12.jpg">
                </div>
                <div class="home-box2-cont">
                    <p>设备管理<span>教师 设备管理员</span></p>
                    <p>本模块主要由设备管理员使用，用于设备管理员出入口操作。</p>
                    <p>教师在授课过程发现设备、器材损坏可以在此提交申请备案，由设备管理员进行管理，可以维修与更新操作。</p>
                    <p>设备管理员可以直观的对实验中已在使用、库存中未投入使用、库存存库数量等进行直观的管理。</p>
                </div>
            </div>
            <hr>
            <div class="home-box3">
                <div class="home-box3-cont1">
                    <p>设备采购<span>设备管理员 系统管理员</span></p>
                    <p>设备管理员在管理设备器材中发现库存不足，或者设备需要更新换代时，在此向系统管理员提交申请。
                        系统管理员审批通过后，设备管理员得意采购入库。</p>
                    <p>本模块正是为方便此中操作过程而设计。</p>
                </div>
                <div class="home-box3-img1">
                    <img src="@/images/13.jpg">
                </div>
            </div>
        </div>
        <div class="box footer">
            <p>声明</p>
            <p>本系统由于用于毕业设计，一切从简。有许多不足之处，若投入实际使用还需要二次开发。</p>
            <p>不足之处如下：</p>
            <p>1、功能不够完善，没有实现数据统计功能，数据统计不直观，未能生成数据报表。</p>
            <p>2、设计只考虑少量用户，多用户同时使用情况下可能导致服务器奔溃。</p>
            <p>3、数据库设计不够合理，对数据的检索造成不便。</p>
            <p>4、没有使用更多的组件优化服务端。</p>
            <p>5、为了简化权限管理，去除动态分配权限功能。</p>
            <p>6、还有其它不足和缺陷还未发现。</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },

    created() {

    },

    methods: {

    },
};
</script>
<style lang="less">
@import "./home.less";

</style>