export const formatDate = (date) => {
    if(date === undefined) return;
    const dateSplited = date.split('T')[0].split('-');
    const year = dateSplited[0];
    const month = dateSplited[1];
    const day = dateSplited[2];
    
    return day + '/' + month + '/' + year
  }