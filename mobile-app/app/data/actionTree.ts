import { actions } from './actions';
import { ActionTree } from './types';

export const actionTree: ActionTree = {
  categories: [
    { 
      title: 'actions.categories.food.title',
      description: 'actions.categories.food.description',
      icon: 'silverware-fork-knife',
      groups: [
        {
          title: 'actions.groups.growYourOwn.title',
          description: 'actions.groups.growYourOwn.description',
          why: 'actions.groups.growYourOwn.why',
          actions: [
            actions.startKitchenGarden,
            actions.joinUrbanGarden,
            actions.regrowYourFood,
            actions.supportLocalSustainableFarmers,
            actions.shopAtFarmersMarkets
          ]
        },
        {
          title: 'actions.groups.useAllYourFood.title',
          description: 'actions.groups.useAllYourFood.description',
          why: 'actions.groups.useAllYourFood.why',
          actions: [
            actions.eatSeasonally,
            actions.shareExcessFood,
            actions.maximizeFreshness,
            actions.avoidPackaging
          ]
        },
        { 
          title: 'actions.groups.proteinSwap.title',
          description: 'actions.groups.proteinSwap.description',
          why: 'actions.groups.proteinSwap.why',
          actions: [
            actions.eatSeasonally,
            actions.plantBasedProteins,
            actions.localFarmers,
            actions.locallyProducedFoods,
            actions.weekdayFlexitarian,
            actions.weekdayVegetarian
          ]
        }
      ]
    },
    {
      title: 'actions.categories.transport.title',
      description: 'actions.categories.transport.description',
      icon: 'train-car',
      groups: []
    },
    {
      title: 'actions.categories.stuff.title',
      description: 'actions.categories.stuff.description',
      icon: 'cart',
      groups: []
    },
    {
      title: 'actions.categories.fun.title',
      description: 'actions.categories.fun.description',
      icon: 'emoticon-happy',
      groups: []
    }
  ]
}