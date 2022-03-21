def get_data(key):
    return get_level_data(fake_db_get(key))


def fake_db_get(key):
    if key == 'Sales':
        return {
            'Sales': { 'Product Charges': 12615.07, 'Shipping': 2251.87, 'Other': { 'Abc': { 'Def': 500, 'Xyz':300 }, 'Ghi': 200.11 } }        
        }
    elif key == 'Expenses':
        return {
            'Expenses': { 'Refunded expenses': 541.85, 'Refunded sales': 3890.82, 'Promo rebates': 1808.24, 'Amazon fees': 5753.55 }
        }
    elif key == 'Other':
        return {
            'Other': { 'Abc': { 'Def': 500, 'Xyz':300 }, 'Ghi': 200.11 } 
        }
    elif key == 'Abc':
        return { 
            'Abc': { 'Def': 500, 'Xyz':300 } 
        }

    return {}


def get_level_data(data):
    out = []

    for root in data:
        for key, value in data[root].items():
            if type(value) in [int, float]:
                out.append([root, key, value, False])
            else:
                val = value_extractor(value)
                out.append([root, key, val, True])

    return out


def value_extractor(subTree):
    val = 0
    s = [(k,v) for k,v in subTree.items()]

    while s:
        k, v = s.pop()
        if type(v) in [int, float]:
            val += v
        else:
            s.extend([(x,y) for x,y in v.items()])

    return val