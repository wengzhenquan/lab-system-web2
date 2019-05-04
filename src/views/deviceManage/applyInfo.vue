<template>
    <div class="box apply-info">
        <p>申请标题：{{equipmentInfo.title}}</p>
        <p>申请人：{{equipmentInfo.applyName}}</p>
        <p>设备类型：{{equipmentInfo.typeName}}</p>
        <div style="display: flex"> <p>申请需求：</p><p>{{equipmentInfo.need}}</p></div>
        <div style="display: flex"> <p>处理结果：</p><p>{{equipmentInfo.result}}</p></div>
        <p>处理人：{{equipmentInfo.handleUserName}}</p>
        <p>申请时间：{{equipmentInfo.creatTime}}</p>
        <p>申请时间：{{equipmentInfo.handleTime}}</p>
        <div><Button @click="goBack">返回上一级</Button></div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                equipmentLogId: null,
                equipmentInfo: [],
            }
        },

        created() {
            this.equipmentLogId = this.$route.query.equipmentLogId;
            this.getEquipment();
        },

        methods: {
            getEquipment() {
                let that = this;
                let url = that.BaseConfig + '/selectEquipmentLoById';
                let params ={
                    equipmentLogId:that.equipmentLogId,
                }
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                           that.equipmentInfo = data.data;
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            goBack() {
                this.$router.push({
                    path: '/repairApply/repairApply'
                })
            },
        },
    }
</script>

<style lang="less" scoped>
    .apply-info {
        color: #000;
        font-size: 15px;
        letter-spacing: 1px;
        padding-left: 12px;
        p {
            line-height: 35px;
        }
    }
</style>