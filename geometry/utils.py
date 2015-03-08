import numpy
from numpy.core.numeric import array


def point_in_poly(x, y, poly):
    n = len(poly)
    inside = False

    p1x, p1y = poly[0]
    for i in range(n + 1):
        p2x, p2y = poly[i % n]
        if y >= min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xints = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xints:
                        inside = not inside
        p1x, p1y = p2x, p2y

    return inside


def point_on_border(x, y, poly):
    n = len(poly)
    for i in range(n):
        p1x, p1y = poly[i]
        p2x, p2y = poly[(i + 1) % n]
        v1x = p2x - p1x
        v1y = p2y - p1y
        v2x = x - p1x
        v2y = y - p1y
        if v1x != 0:
            if v1x * v2y - v1y * v2x == 0:
                if v2x / v1x > 0:
                    if v1x * v1x + v1y * v1y >= v2x * v2x + v2y * v2y:
                        return True
    return False


def closest_node(node, nodes):
    node = array(node)
    nodes = array(nodes)
    for i in nodes:
        print sum((node - i) ** 2, 1).argmin()


def find_nearest_vector(array, value):
    idx = numpy.array([numpy.linalg.norm(x + y) for (x, y) in array - value]).argmin()
    return array[idx]