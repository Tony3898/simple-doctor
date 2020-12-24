export default (search,dataList)=>{
  return search && search.length && dataList && dataList.length ? dataList.filter(b => Object.keys(b).some(k => b[k] ? b[k].toString().toLowerCase().includes(search.toLowerCase()) : false)) : dataList
}