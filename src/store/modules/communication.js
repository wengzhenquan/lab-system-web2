const communication = {
    state: {
        batchRechargeList: []
    },
    mutations: {
    // flag 是否是取消操作 0 选中 1 取消选中
        setBatchRechargeList (state, obj) {
            if (obj.flag) {
                obj.list.forEach(item => {
                    let index = state.batchRechargeList.indexOf(item);
                    if (index > -1) {
                        state.batchRechargeList.splice(index, 1);
                    }
                });
            } else {
                state.batchRechargeList = [...new Set(state.batchRechargeList.concat(obj.list))];
            }
        },
        resetBatchRechargeList (state) {
            state.batchRechargeList = [];
        }
    }
};

export default communication;
