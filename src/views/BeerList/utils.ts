import { getBeerList, getBeerMetaData, searchBeerList } from '../../api';
import { Beer, Meta } from '../../types';
import handle from '../../utils/error';

const fetchData = async (setBeerList: (data: Array<Beer>) => void, customParam?: object) => {
  try {
    const response = await getBeerList(customParam);
    setBeerList(response.data)
  } catch (error) {
    handle(error);
  }
};

const fetchMetaData = async (setTotalBrewers: (data: Meta) => void) => {
  try {
    const response = await getBeerMetaData();
    setTotalBrewers(response.data);
  } catch (error) {
    handle(error);
  }
};

const searchData = async (setBeerList: (data: Array<Beer>) => void, customSearchParam: string) => {
  try {
    const response = await searchBeerList(customSearchParam);
    setBeerList(response.data);
  } catch (error) {
    handle(error);
  }
};

export { fetchData, fetchMetaData, searchData };
